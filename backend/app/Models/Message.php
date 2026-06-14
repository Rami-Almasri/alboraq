<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Message extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'conversation_id',
        'sender_id',
        'body',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Image/file attachments sent with the message (Spatie Media Library).
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('attachments');
    }

    public function attachmentUrls(): array
    {
        return $this->getMedia('attachments')->map(fn (Media $m) => [
            'url' => $m->getUrl(),
            'name' => $m->file_name,
            'mime' => $m->mime_type,
            'size' => $m->size,
        ])->all();
    }
}
