<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('story');
            $table->string('creator_name');
            $table->string('creator_email');
            $table->string('category');
            $table->decimal('goal_amount', 12, 2);
            $table->decimal('raised_amount', 12, 2)->default(0);
            $table->unsignedInteger('donor_count')->default(0);
            $table->string('status')->default('approved')->index();
            $table->string('image_url')->nullable();
            $table->date('ends_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
