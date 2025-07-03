<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('USER')->after('email');
            $table->string('lname')->nullable();;
            $table->string('fname')->nullable();;
            $table->dropColumn('name');
            $table->string('last_on')->nullable();
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->string('fname')->nullable();;
            $table->string('lname')->nullable();;
            $table->decimal('stars', 2, 1)->nullable();
            $table->string('occupation')->nullable();
            $table->text('description')->nullable();
            $table->string('status')->default('PENDING');
            $table->timestamps();
        });

        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cars_id')->constrained()->onDelete('cascade');
            $table->string('attachament_path')->nullable();
            $table->dateTime('estimated_date')->nullable();
            $table->string('status')->default('PENDING');
            $table->uuid('unique_id')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->integer('year')->nullable();
            $table->string('color')->nullable();
            $table->string('vin')->unique()->nullable();
            $table->string('license_plate')->unique()->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('reviews');
    }
};
