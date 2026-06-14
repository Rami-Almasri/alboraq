<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'conversation_id' => $this->conversation_id,
            'sender_id' => $this->sender_id,
            'sender_name' => $this->sender?->name,
            'is_agent' => $this->sender?->hasAnyRole(['admin', 'support']) ?? false,
            'body' => $this->body,
            'attachments' => $this->attachmentUrls(),
            'is_read' => $this->is_read,
            'created_at' => $this->created_at,
        ];
    }
}
