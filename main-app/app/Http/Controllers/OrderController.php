<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class OrderController extends Controller
{
    public function checkout(Request $request)
    {
        if (!$request->has('total') || $request->total <= 0) {
            return response()->json(['error' => 'Total harga tidak valid'], 400);
        }

        DB::beginTransaction();

        try {
            // --- PERUBAHAN DI SINI ---
            // Kita insert data beneran ke tabel 'orders' di MySQL
            // insertGetId akan menyimpan data dan mengembalikan ID barunya
            $orderId = DB::table('orders')->insertGetId([
                'user_id' => 1, // Hardcode user 1 dulu
                'total_price' => $request->total,
                'status' => 'paid',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Kirim Log ke Node.js
            $response = Http::post('http://node-logger:3000/logs', [
                'service' => 'laravel_backend',
                'action'  => 'checkout_created',
                'user_id' => 1,
                'details' => [
                    'order_id' => $orderId,
                    'amount'   => $request->total
                ]
            ]);

            if ($response->failed()) {
                throw new \Exception("Gagal mencatat log ke Node.js");
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Order berhasil disimpan di MySQL & Log tercatat di MongoDB!',
                'order_id' => $orderId
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}