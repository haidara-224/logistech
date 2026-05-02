<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AdminActivityEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly string $type,
        public readonly string $message,
        public readonly array $data = [],
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('admin-activities'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'activity';
    }
}
