<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\ConversationResource;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Services\ChatService;

class AdminChatController extends Controller
{
    private $chatService;

    public function __construct(ChatService $chatService)
    {
        $this->chatService = $chatService;
    }

    /**
     * All customer conversations for the support dashboard.
     */
    public function index()
    {
        try {
            $conversations = $this->chatService->listConversations();
            $result = ConversationResource::collection($conversations);

            return ResponseHelper::SuccessResponse($result, 'Conversations', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse($e->getMessage());
        }
    }

    public function show(Conversation $conversation)
    {
        try {
            $result = ConversationResource::make(
                $this->chatService->showConversation($conversation)
            );

            return ResponseHelper::SuccessResponse($result, 'Conversation', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function store(StoreMessageRequest $request, Conversation $conversation)
    {
        try {
            $message = $this->chatService->sendMessage(
                $conversation,
                auth()->user(),
                $request->input('body'),
                $request->file('attachment')
            );
            $result = MessageResource::make($message);

            return ResponseHelper::SuccessResponse($result, 'Reply Sent', 201);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }
}
