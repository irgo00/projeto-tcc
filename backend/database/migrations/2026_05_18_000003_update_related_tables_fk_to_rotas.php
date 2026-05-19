<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private function dropFkIfExists(string $table, string $column): void
    {
        $fkName = "{$table}_{$column}_foreign";
        $exists = DB::select(
            "SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE
             WHERE TABLE_SCHEMA = DATABASE()
               AND TABLE_NAME = ?
               AND CONSTRAINT_NAME = ?
               AND REFERENCED_TABLE_NAME IS NOT NULL",
            [$table, $fkName]
        );
        if ($exists) {
            Schema::table($table, fn(Blueprint $t) => $t->dropForeign([$column]));
        }
    }

    private function dropIndexIfExists(string $table, string $indexName): void
    {
        $exists = DB::select(
            "SELECT INDEX_NAME FROM information_schema.STATISTICS
             WHERE TABLE_SCHEMA = DATABASE()
               AND TABLE_NAME = ?
               AND INDEX_NAME = ?",
            [$table, $indexName]
        );
        if ($exists) {
            DB::statement("ALTER TABLE `{$table}` DROP INDEX `{$indexName}`");
        }
    }

    public function up(): void
    {
        // ---- coordenadas ----
        if (Schema::hasColumn('coordenadas', 'van_id')) {
            $this->dropFkIfExists('coordenadas', 'van_id');
            $this->dropIndexIfExists('coordenadas', 'coordenadas_van_id_ordem_index');
            Schema::table('coordenadas', fn(Blueprint $t) => $t->renameColumn('van_id', 'rota_id'));
            Schema::table('coordenadas', function (Blueprint $table) {
                $table->foreign('rota_id')->references('id')->on('rotas')->onDelete('cascade');
                $table->index(['rota_id', 'ordem']);
            });
        }

        // ---- avaliacoes ----
        if (Schema::hasColumn('avaliacoes', 'van_id')) {
            $this->dropFkIfExists('avaliacoes', 'van_id');
            // Cria índice avulso em usuario_id para que o unique composto possa ser dropado
            $this->dropIndexIfExists('avaliacoes', 'avaliacoes_usuario_id_index');
            Schema::table('avaliacoes', fn(Blueprint $t) => $t->index('usuario_id'));
            $this->dropIndexIfExists('avaliacoes', 'avaliacoes_van_id_index');
            $this->dropIndexIfExists('avaliacoes', 'avaliacoes_usuario_id_van_id_unique');
            Schema::table('avaliacoes', fn(Blueprint $t) => $t->renameColumn('van_id', 'rota_id'));
            Schema::table('avaliacoes', function (Blueprint $table) {
                $table->foreign('rota_id')->references('id')->on('rotas')->onDelete('cascade');
                $table->unique(['usuario_id', 'rota_id']);
                $table->index('rota_id');
            });
        }

        // ---- favoritos ----
        if (Schema::hasColumn('favoritos', 'van_id')) {
            $this->dropFkIfExists('favoritos', 'van_id');
            $this->dropIndexIfExists('favoritos', 'favoritos_usuario_id_van_id_unique');
            Schema::table('favoritos', fn(Blueprint $t) => $t->renameColumn('van_id', 'rota_id'));
            Schema::table('favoritos', function (Blueprint $table) {
                $table->foreign('rota_id')->references('id')->on('rotas')->onDelete('cascade');
                $table->unique(['usuario_id', 'rota_id']);
            });
        }

        // ---- historico_contatos ----
        if (Schema::hasColumn('historico_contatos', 'van_id')) {
            $this->dropFkIfExists('historico_contatos', 'van_id');
            $this->dropIndexIfExists('historico_contatos', 'historico_contatos_van_id_index');
            Schema::table('historico_contatos', fn(Blueprint $t) => $t->renameColumn('van_id', 'rota_id'));
            Schema::table('historico_contatos', function (Blueprint $table) {
                $table->foreign('rota_id')->references('id')->on('rotas')->onDelete('cascade');
                $table->index('rota_id');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('coordenadas', 'rota_id')) {
            $this->dropFkIfExists('coordenadas', 'rota_id');
            $this->dropIndexIfExists('coordenadas', 'coordenadas_rota_id_ordem_index');
            Schema::table('coordenadas', fn(Blueprint $t) => $t->renameColumn('rota_id', 'van_id'));
            Schema::table('coordenadas', function (Blueprint $table) {
                $table->foreign('van_id')->references('id')->on('vans')->onDelete('cascade');
                $table->index(['van_id', 'ordem']);
            });
        }

        if (Schema::hasColumn('avaliacoes', 'rota_id')) {
            $this->dropFkIfExists('avaliacoes', 'rota_id');
            $this->dropIndexIfExists('avaliacoes', 'avaliacoes_rota_id_index');
            $this->dropIndexIfExists('avaliacoes', 'avaliacoes_usuario_id_rota_id_unique');
            Schema::table('avaliacoes', fn(Blueprint $t) => $t->renameColumn('rota_id', 'van_id'));
            Schema::table('avaliacoes', function (Blueprint $table) {
                $table->foreign('van_id')->references('id')->on('vans')->onDelete('cascade');
                $table->unique(['usuario_id', 'van_id']);
                $table->index('van_id');
            });
        }

        if (Schema::hasColumn('favoritos', 'rota_id')) {
            $this->dropFkIfExists('favoritos', 'rota_id');
            $this->dropIndexIfExists('favoritos', 'favoritos_usuario_id_rota_id_unique');
            Schema::table('favoritos', fn(Blueprint $t) => $t->renameColumn('rota_id', 'van_id'));
            Schema::table('favoritos', function (Blueprint $table) {
                $table->foreign('van_id')->references('id')->on('vans')->onDelete('cascade');
                $table->unique(['usuario_id', 'van_id']);
            });
        }

        if (Schema::hasColumn('historico_contatos', 'rota_id')) {
            $this->dropFkIfExists('historico_contatos', 'rota_id');
            $this->dropIndexIfExists('historico_contatos', 'historico_contatos_rota_id_index');
            Schema::table('historico_contatos', fn(Blueprint $t) => $t->renameColumn('rota_id', 'van_id'));
            Schema::table('historico_contatos', function (Blueprint $table) {
                $table->foreign('van_id')->references('id')->on('vans')->onDelete('cascade');
                $table->index('van_id');
            });
        }
    }
};
