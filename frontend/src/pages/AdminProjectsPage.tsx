/**
 * Admin command center: paginated project table with Edit / Delete actions.
 * Pagination totals come from the API response only; the loading effect depends on pageNum/pageSize
 * — never on a derived total — to avoid useEffect ↔ setState feedback loops.
 */
import { useState, useEffect, useCallback } from 'react';
import Pagination from '../components/Pagination';
import NewProjectForm from '../components/NewProjectForm';
import EditProjectForm from '../components/EditProjectForm';
import {
    fetchAdminProjectsPage,
    type AdminProject,
    type FetchAdminProjectsResponse,
} from '../api/projects-api';

export default function AdminProjectsPage() {
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(true);
    const [listPayload, setListPayload] = useState<FetchAdminProjectsResponse>({
        projects: [],
        totalNumProjects: 0,
    });
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState<AdminProject | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const hideForm = useCallback(() => {
        setShowForm(false);
        setEditingProject(null);
    }, []);

    const refreshData = useCallback(() => {
        setLoading(true);
        fetchAdminProjectsPage({ pageNum, pageSize })
            .then((data) => {
                setListPayload(data);
                hideForm();
            })
            .catch((err) => console.error('Admin projects fetch failed:', err))
            .finally(() => setLoading(false));
    }, [pageNum, pageSize, hideForm]);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        fetchAdminProjectsPage({ pageNum, pageSize })
            .then((data) => {
                if (!cancelled) {
                    setListPayload(data);
                }
            })
            .catch((err) => console.error('Admin projects fetch failed:', err))
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [pageNum, pageSize]);

    const { projects, totalNumProjects } = listPayload;
    const totalPages = Math.max(1, Math.ceil(totalNumProjects / pageSize));

    const handleEdit = (row: AdminProject) => {
        setDeletingId(null);
        setShowForm(false);
        setEditingProject(row);
    };

    const handleDelete = (row: AdminProject) => {
        setShowForm(false);
        setEditingProject(null);
        setDeletingId(row.id);
    };

    return (
        <div className="container mt-4">
            <h1 className="h3 mb-3">Admin — Projects</h1>

            <div className="d-flex flex-wrap gap-2 mb-3">
                <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {
                        setDeletingId(null);
                        setEditingProject(null);
                        setShowForm(true);
                    }}
                >
                    New project
                </button>
            </div>

            {showForm && <NewProjectForm onSuccess={refreshData} onCancel={hideForm} />}
            {editingProject && (
                <EditProjectForm project={editingProject} onSuccess={refreshData} onCancel={hideForm} />
            )}

            {deletingId !== null && (
                <div className="alert alert-warning" role="status">
                    <p className="mb-0">
                        Delete flow placeholder for project ID <strong>{deletingId}</strong> (confirm modal
                        or DELETE request here).
                    </p>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary mt-2"
                        onClick={() => setDeletingId(null)}
                    >
                        Dismiss
                    </button>
                </div>
            )}

            <Pagination
                currentPage={pageNum}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={setPageNum}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPageNum(1);
                }}
                showPageNavigation={false}
                pageSizeSelectId="admin-projects-page-size"
            />

            {loading ? (
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading projects…</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Regional Program</th>
                                    <th scope="col">Impact</th>
                                    <th scope="col">Phase</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((row) => (
                                    <tr key={row.id}>
                                        <td>{row.id}</td>
                                        <td>{row.name}</td>
                                        <td>{row.type}</td>
                                        <td>{row.regionalProgram}</td>
                                        <td>{row.impact}</td>
                                        <td>{row.phase}</td>
                                        <td>{row.status}</td>
                                        <td>
                                            <div className="d-flex flex-wrap gap-1">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => handleEdit(row)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(row)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        currentPage={pageNum}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        onPageChange={setPageNum}
                        onPageSizeChange={(size) => {
                            setPageSize(size);
                            setPageNum(1);
                        }}
                        showPageSizeControls={false}
                        totalItems={totalNumProjects}
                        totalItemsLabel="total"
                        totalItemsEmptyLabel="projects"
                    />
                </>
            )}
        </div>
    );
}
