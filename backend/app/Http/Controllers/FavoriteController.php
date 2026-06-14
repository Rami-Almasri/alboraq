<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Resources\FavoriteResource;
use App\Services\FavoriteService;

class FavoriteController extends Controller
{
    private $favoriteService;

    public function __construct(FavoriteService $favoriteService)
    {
        $this->favoriteService = $favoriteService;
    }

    public function index()
    {
        try {
            $favorite = $this->favoriteService->index();
            $result = FavoriteResource::collection($favorite);

            return ResponseHelper::SuccessResponse($result, 'Favorite List', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse($e->getMessage());
        }
    }

    /**
     * Toggle a product in/out of the user's favorites.
     */
    public function store($productId)
    {
        try {
            $fav = $this->favoriteService->store($productId);

            if (is_null($fav)) {
                return ResponseHelper::SuccessResponse(null, 'Favorite Removed', 200);
            }

            $result = FavoriteResource::make($fav);

            return ResponseHelper::SuccessResponse($result, 'Favorite Created', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function destroy($productId)
    {
        try {
            $this->favoriteService->destroy($productId);

            return ResponseHelper::SuccessResponse(null, 'Favorite Deleted', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }
}
