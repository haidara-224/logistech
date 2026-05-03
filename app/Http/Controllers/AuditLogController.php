<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Response;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index()
    {
        $search = request()->input('search', '');
        $action = request()->input('action', '');
        $model = request()->input('model', '');
        $dateFrom = request()->input('date_from', '');
        $dateTo = request()->input('date_to', '');

        $query = AuditLog::with('user')->orderByDesc('created_at');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhere('action', 'like', "%{$search}%")
                    ->orWhere('model_type', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%"));
            });
        }

        if ($action) {
            $query->where('action', $action);
        }

        if ($model) {
            $query->where('model_type', 'like', "%{$model}%");
        }

        if ($dateFrom) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        $logs = $query->paginate(50);

        $actions = AuditLog::select('action')->distinct()->orderBy('action')->pluck('action');
        $models = AuditLog::select('model_type')->distinct()->orderBy('model_type')->pluck('model_type')
            ->map(fn ($m) => class_basename($m));

        return Inertia::render('audit/Index', [
            'logs' => $logs,
            'filters' => ['search' => $search, 'action' => $action, 'model' => $model, 'date_from' => $dateFrom, 'date_to' => $dateTo],
            'actions' => $actions,
            'models' => $models->unique()->values(),
        ]);
    }

    public function export(): Response
    {
        $search = request()->input('search', '');
        $action = request()->input('action', '');
        $model = request()->input('model', '');
        $dateFrom = request()->input('date_from', '');
        $dateTo = request()->input('date_to', '');

        $query = AuditLog::with('user')->orderByDesc('created_at');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhere('action', 'like', "%{$search}%")
                    ->orWhere('model_type', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%"));
            });
        }

        if ($action) {
            $query->where('action', $action);
        }

        if ($model) {
            $query->where('model_type', 'like', "%{$model}%");
        }

        if ($dateFrom) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        $logs = $query->limit(2000)->get();

        $filters = array_filter(['search' => $search, 'action' => $action, 'model' => $model, 'date_from' => $dateFrom, 'date_to' => $dateTo]);

        return response()->view('audit.export', [
            'logs' => $logs,
            'filters' => $filters,
            'generatedAt' => now()->format('d/m/Y à H:i'),
            'total' => $logs->count(),
        ]);
    }
}
