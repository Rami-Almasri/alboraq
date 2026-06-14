<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConversationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'subject' => $this->subject,
            'user' => new UserResource($this->whenLoaded('user')),
            'agent' => new UserResource($this->whenLoaded('agent')),
            'last_message_at' => $this->last_message_at,
            'unread_count' => $this->when(isset($this->unread_count), $this->unread_count),
            'last_message' => $this->whenLoaded('latestMessage', function () {
                $last = $this->latestMessage->first();
                return $last ? [
                    'body' => $last->body,
                    'created_at' => $last->created_at,
                ] : null;
            }),
            'messages' => MessageResource::collection($this->whenLoaded('messages')),
            'created_at' => $this->created_at,
        ];
    }
}
