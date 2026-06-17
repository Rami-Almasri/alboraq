<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;

class AdminStatsController extends Controller
{
    /**
     * Aggregated metrics for the admin dashboard overview.
     */
    public function index()
    {
        try {
            // Revenue excludes cancelled orders.
            $revenue = (float) Order::where('status', '!=', 'cancelled')->sum('total');

            $statusCounts = Order::selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status');

            $recentOrders = Order::with(['user', 'items'])->latest()->take(6)->get();

            // Best sellers by quantity sold (aggregated across all orders).
            $topProducts = OrderItem::selectRaw('product_name, SUM(quantity) as qty, SUM(line_total) as revenue')
                ->groupBy('product_name')
                ->orderByDesc('qty')
                ->take(5)
                ->get()
                ->map(fn ($row) => [
                    'name' => $row->product_name,
                    'qty' => (int) $row->qty,
                    'revenue' => (float) $row->revenue,
                ]);

            return ResponseHelper::SuccessResponse([
                'totals' => [
                    'revenue' => $revenue,
                    'orders' => Order::count(),
                    'products' => Product::count(),
                    'active_products' => Product::where('is_active', true)->count(),
                    'low_stock' => Product::where('stock', '>', 0)->where('stock', '<=', 5)->count(),
                    'out_of_stock' => Product::where('stock', 0)->count(),
                    'customers' => User::count(),
                ],
                'status_counts' => $statusCounts,
                'revenue_series' => $this->monthlyRevenue(),
                'top_products' => $topProducts,
                'recent_orders' => OrderResource::collection($recentOrders),
            ], 'Dashboard stats', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    /**
     * Revenue for the last 6 months, grouped in PHP so it stays
     * database-agnostic (SQLite has no DATE_FORMAT).
     */
    private function monthlyRevenue(): array
    {
        $start = now()->startOfMonth()->subMonths(5);

        $orders = Order::where('status', '!=', 'cancelled')
            ->where('created_at', '>=', $start)
            ->get(['total', 'created_at']);

        // Seed 6 empty buckets so months with no sales still render.
        $buckets = [];
        for ($i = 0; $i < 6; $i++) {
            $month = $start->copy()->addMonths($i);
            $buckets[$month->format('Y-m')] = [
                'label' => $month->translatedFormat('M'),
                'month' => $month->format('Y-m'),
                'total' => 0.0,
            ];
        }

        foreach ($orders as $order) {
            $key = $order->created_at->format('Y-m');
            if (isset($buckets[$key])) {
                $buckets[$key]['total'] += (float) $order->total;
            }
        }

        return array_values($buckets);
    }
}
