<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http; // Library untuk kirim request ke Node.js

class OrderController extends Controller
{
    public function checkout(Request $request)
    {
        // 1. Validasi Input Sederhana
        // (Dalam interview, validasi itu wajib!)
        if (!$request->has('total') || $request->total <= 0) {
            return response()->json(['error' => 'Total harga tidak valid'], 400);
        }

        // 2. Database Transaction (MySQL)
        // Ini poin plus interview: Menjaga data tetap konsisten (ACID).
        DB::beginTransaction();

        try {
            // A. Simulasi simpan order ke MySQL (Kita skip buat Model biar cepat, pakai Query Builder aja)
            // Pastikan tabel 'orders' sudah ada (hasil migrate tadi).
            // Kalau error "Table not found", jalankan migrasi dulu.
            
            // Simulasi sukses query DB
            $orderId = rand(1000, 9999); 

            // B. Kirim Log ke Node.js (Microservice Call)
            // PENTING: Gunakan nama service docker "node-logger", JANGAN "localhost".
            // Karena Laravel jalan di dalam container, "localhost" bagi dia adalah dirinya sendiri.
            $response = Http::post('http://node-logger:3000/logs', [
                'service' => 'laravel_backend',
                'action'  => 'checkout_created',
                'user_id' => 1, // Hardcode dulu user_id 1
                'details' => [
                    'order_id' => $orderId,
                    'amount'   => $request->total
                ]
            ]);

            // Cek apakah Node.js merespon sukses?
            if ($response->failed()) {
                throw new \Exception("Gagal mencatat log ke Node.js");
            }

            // Jika semua lancar, simpan permanen ke MySQL
            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Order berhasil dan Log tercatat!',
                'order_id' => $orderId
            ]);

        } catch (\Exception $e) {
            // Jika ada error, batalkan semua perubahan di database
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}