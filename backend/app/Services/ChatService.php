<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\UploadedFile;

class ChatService
{
    /**
     * Get (or create) the current customer's support conversation.
     */
    public function myConversation(User $user): Conversation
    {
        $conversation = Conversation::firstOrCreate(
            ['user_id' => $user->id, 'status' => 'open'],
            ['subject' => 'دعم العملاء']
        );

        return $conversation->load(['messages.sender', 'agent']);
    }

    /**
     * Mark agent messages as read for the customer.
     */
    public function markReadForCustomer(Conversation $conversation): void
    {
        $conversation->messages()
            ->where('sender_id', '!=', $conversation->user_id)
            ->where('is_read', false)
            ->update(['is_read' => true]);
    }

    /**
     * List all conversations for the support dashboard, newest first.
     */
    public function listConversations()
    {
        return Conversation::query()
            ->with(['user', 'agent', 'latestMessage.sender'])
            ->withCount(['messages as unread_count' => function ($q) {
                $q->where('is_read', false)
                    ->whereColumn('messages.sender_id', 'conversations.user_id');
            }])
            ->orderByDesc('last_message_at')
            ->orderByDesc('created_at')
            ->get();
    }

    /**
     * Load a conversation for an agent and mark customer messages read.
     */
    public function showConversation(Conversation $conversation): Conversation
    {
        $conversation->messages()
            ->where('sender_id', $conversation->user_id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return $conversation->load(['messages.sender', 'user', 'agent']);
    }

    /**
     * Persist a message (with an optional image attachment).
     */
    public function sendMessage(
        Conversation $conversation,
        User $sender,
        ?string $body = null,
        ?UploadedFile $file = null
    ): Message {
        $message = $conversation->messages()->create([
            'sender_id' => $sender->id,
            'body' => $body,
        ]);

        if ($file) {
            $message->addMedia($file)->toMediaCollection('attachments');
        }

        $isAgent = $sender->hasAnyRole(['admin', 'support']);

        $conversation->forceFill([
            'last_message_at' => now(),
            'agent_id' => $conversation->agent_id ?: ($isAgent ? $sender->id : null),
        ])->save();

        return $message->load('sender');
    }
}
