<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\ConversationResource;
use App\Http\Resources\MessageResource;
use App\Services\ChatService;

class ChatController extends Controller
{
    private $chatService;

    public function __construct(ChatService $chatService)
    {
        $this->chatService = $chatService;
    }

    /**
     * The current customer's support conversation (created on demand).
     */
    public function show()
    {
        try {
            $conversation = $this->chatService->myConversation(auth()->user());
            $result = ConversationResource::make($conversation);

            return ResponseHelper::SuccessResponse($result, 'Conversation', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    /**
     * Send a message (optionally with an image attachment).
     */
    public function store(StoreMessageRequest $request)
    {
        try {
            $conversation = $this->chatService->myConversation(auth()->user());
            $message = $this->chatService->sendMessage(
                $conversation,
                auth()->user(),
                $request->input('body'),
                $request->file('attachment')
            );
            $result = MessageResource::make($message);

            return ResponseHelper::SuccessResponse($result, 'Message Sent', 201);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    /**
     * Mark agent messages as read.
     */
    public function markRead()
    {
        try {
            $conversation = $this->chatService->myConversation(auth()->user());
            $this->chatService->markReadForCustomer($conversation);

            return ResponseHelper::SuccessResponse(null, 'Marked Read', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }
}
