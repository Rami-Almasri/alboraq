<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Resources\AdminUserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        try {
            $users = User::query()
                ->withCount('orders')
                ->with('roles')
                ->when($request->filled('search'), function ($q) use ($request) {
                    $term = $request->input('search');
                    $q->where(function ($w) use ($term) {
                        $w->where('name', 'like', "%{$term}%")
                            ->orWhere('email', 'like', "%{$term}%")
                            ->orWhere('phone', 'like', "%{$term}%");
                    });
                })
                ->latest()
                ->paginate((int) $request->input('per_page', 30));

            return ResponseHelper::SuccessResponse(
                AdminUserResource::collection($users),
                'Admin User List',
                200
            );
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    /**
     * Update a user's roles.
     */
    public function update(Request $request, User $user)
    {
        try {
            $data = $request->validate([
                'roles' => ['present', 'array'],
                'roles.*' => ['string', 'exists:roles,name'],
            ]);

            // Guard against an admin stripping their own admin access (lockout).
            if ($user->id === auth()->id() && ! in_array('admin', $data['roles'], true)) {
                return ResponseHelper::FailureResponse(
                    null,
                    'لا يمكنك إزالة صلاحية المدير عن حسابك الحالي.',
                    422
                );
            }

            $user->syncRoles($data['roles']);

            return ResponseHelper::SuccessResponse(
                AdminUserResource::make($user->load('roles')->loadCount('orders')),
                'User roles updated',
                200
            );
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function destroy(User $user)
    {
        try {
            if ($user->id === auth()->id()) {
                return ResponseHelper::FailureResponse(null, 'لا يمكنك حذف حسابك الحالي.', 422);
            }

            $user->delete();

            return ResponseHelper::SuccessResponse(null, 'User deleted', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    /**
     * Available role names for the role picker.
     */
    public function roles()
    {
        try {
            return ResponseHelper::SuccessResponse(
                Role::orderBy('name')->pluck('name'),
                'Roles',
                200
            );
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }
}
