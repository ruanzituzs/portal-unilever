import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsersService, User } from '../../../core/services/users.service';

@Component({
    selector: 'app-user-manager',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './user-manager.html'
})
export class UserManagerComponent implements OnInit {
    users: User[] = [];
    loading = true;
    error = '';
    deletingId: string | null = null;
    deletingError = '';

    constructor(private usersService: UsersService) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.loading = true;
        this.error = '';
        this.usersService.getUsers().subscribe({
            next: (data: User[]) => {
                // Mapeia para garantir ordenação (ex: admins/managers primeiro, etc) 
                // ou você pode só usar a ordem que a API mandar
                this.users = data;
                this.loading = false;
            },
            error: (err: any) => {
                this.error = 'Não foi possível carregar a lista de usuários. Tente novamente mais tarde.';
                this.loading = false;
                console.error(err);
            }
        });
    }

    deleteUser(user: User): void {
        if (confirm(`Tem certeza que deseja DELETAR o acesso de ${user.name}? Esta ação não pode ser desfeita.`)) {
            this.deletingId = user.id;
            this.deletingError = '';

            this.usersService.deleteUser(user.id).subscribe({
                next: () => {
                    // Remover da lista visualmente pra não precisar recarregar
                    this.users = this.users.filter(u => u.id !== user.id);
                    this.deletingId = null;
                    alert('Usuário removido com sucesso!');
                },
                error: (err: any) => {
                    this.deletingError = `Falha ao tentar excluir ${user.name}.`;
                    this.deletingId = null;
                    console.error(err);
                }
            });
        }
    }

    getRoleLabel(role: string): string {
        switch (role) {
            case 'MANAGER': return 'Administrador';
            case 'EMPLOYEE': return 'Colaborador';
            default: return role;
        }
    }

    getRoleBadgeClass(role: string): string {
        switch (role) {
            case 'MANAGER': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'EMPLOYEE': return 'bg-blue-100 text-[#1F36C7] border-blue-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    }
}
