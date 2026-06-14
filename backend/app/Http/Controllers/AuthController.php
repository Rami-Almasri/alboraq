<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;

class AuthController extends Controller
{
    private $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(RegisterRequest $request)
    {
        try {
            $result = $this->authService->register($request->validated());

            return ResponseHelper::SuccessResponse([
                'user' => UserResource::make($result['user']),
                'token' => $result['token'],
            ], 'Account created successfully', 201);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function login(LoginRequest $request)
    {
        try {
            $result = $this->authService->login($request->validated());

            return ResponseHelper::SuccessResponse([
                'user' => UserResource::make($result['user']),
                'token' => $result['token'],
            ], 'Logged in successfully', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage(), 401);
        }
    }

    public function logout()
    {
        try {
            $this->authService->logout();

            return ResponseHelper::SuccessResponse(null, 'Logged out successfully', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function me()
    {
        try {
            return ResponseHelper::SuccessResponse(
                UserResource::make(auth()->user()),
                'Authenticated user',
                200
            );
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }
}
