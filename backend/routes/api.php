<?php

use App\Http\Controllers\AdminChatController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category:slug}', [CategoryController::class, 'show']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/products/{product}/reviews', [ReviewController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Protected routes (require Sanctum token)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites/{productId}', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{productId}', [FavoriteController::class, 'destroy']);

    // Cart
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/{productId}', [CartController::class, 'store']);
    Route::put('/cart/{productId}', [CartController::class, 'update']);
    Route::delete('/cart/{productId}', [CartController::class, 'destroy']);

    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);

    // Coupons
    Route::post('/coupons/validate', [CouponController::class, 'validateCoupon']);

    // Reviews
    Route::post('/products/{product}/reviews', [ReviewController::class, 'store']);

    // Customer support chat
    Route::get('/chat', [ChatController::class, 'show']);
    Route::post('/chat/messages', [ChatController::class, 'store']);
    Route::post('/chat/read', [ChatController::class, 'markRead']);

    /*
    |----------------------------------------------------------------------
    | Support / admin only (Spatie role middleware)
    |----------------------------------------------------------------------
    */
    Route::middleware('role:admin|support')->prefix('admin')->group(function () {
        Route::get('/conversations', [AdminChatController::class, 'index']);
        Route::get('/conversations/{conversation}', [AdminChatController::class, 'show']);
        Route::post('/conversations/{conversation}/messages', [AdminChatController::class, 'store']);
    });
});
