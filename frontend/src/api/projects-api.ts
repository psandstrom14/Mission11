import type { Book } from '../components/BookList';

/**
 * App Service host only — no path, no trailing slash.
 *
 * Trailing-slash trap: if this were `...azurewebsites.net/`, then `${API_URL}/api/books` becomes
 * `...net//api/books` (double slash). Some servers return 404 or fail CORS preflight. Always keep the
 * host clean; `VITE_API_URL` is normalized the same way.
 *
 * Override with `VITE_API_URL` in Static Web Apps / `.env.production` (still no trailing slash).
 */
export const API_URL = (
    import.meta.env.VITE_API_URL ??
    (import.meta.env.DEV
        ? 'http://localhost:5010'
        : 'https://mission13-bookstore-api-f8g9a8e7bkgbbydy.eastus-01.azurewebsites.net')
).replace(/\/+$/, '');

/**
 * `${API_URL}/api` — bookstore uses `BooksController` (`/api/books/...`); admin CRUD uses
 * `AdminProjectsController` (`/api/AdminProjects/...`). Both live on the same API host.
 */
export const API_BASE = `${API_URL}/api`;

export interface FetchProjectsResponse {
    books: Book[];
    totalCount: number;
}

export async function fetchProjects({
    pageNum,
    pageSize,
    sortBy,
    selectedCategories,
}: {
    pageNum: number;
    pageSize: number;
    sortBy: string;
    selectedCategories: string[];
}): Promise<FetchProjectsResponse> {
    const categoryQuery =
        selectedCategories.length > 0
            ? selectedCategories.map((c) => `&category=${encodeURIComponent(c)}`).join('')
            : '';

    const url = `${API_BASE}/books?pageNum=${pageNum}&pageSize=${pageSize}&sortBy=${encodeURIComponent(sortBy)}${categoryQuery}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<FetchProjectsResponse>;
}

/** Admin grid row (matches api/AdminProjects JSON, camelCase). */
export interface AdminProject {
    id: number;
    name: string;
    type: string;
    regionalProgram: string;
    impact: string;
    phase: string;
    status: string;
}

export interface FetchAdminProjectsResponse {
    projects: AdminProject[];
    totalNumProjects: number;
}

export async function fetchAdminProjectsPage({
    pageNum,
    pageSize,
}: {
    pageNum: number;
    pageSize: number;
}): Promise<FetchAdminProjectsResponse> {
    const url = `${API_BASE}/AdminProjects?pageNum=${pageNum}&pageSize=${pageSize}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch admin projects: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<FetchAdminProjectsResponse>;
}

export type AdminProjectInput = Omit<AdminProject, 'id'>;

export async function createAdminProject(body: AdminProjectInput): Promise<AdminProject> {
    const response = await fetch(`${API_BASE}/AdminProjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: body.name,
            type: body.type,
            regionalProgram: body.regionalProgram,
            impact: body.impact,
            phase: body.phase,
            status: body.status,
        }),
    });
    if (!response.ok) {
        throw new Error(`Failed to create project: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<AdminProject>;
}

export async function updateAdminProject(id: number, body: AdminProjectInput): Promise<AdminProject> {
    const response = await fetch(`${API_BASE}/AdminProjects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: body.name,
            type: body.type,
            regionalProgram: body.regionalProgram,
            impact: body.impact,
            phase: body.phase,
            status: body.status,
        }),
    });
    if (!response.ok) {
        throw new Error(`Failed to update project: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<AdminProject>;
}
