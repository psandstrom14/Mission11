import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { updateAdminProject, type AdminProject, type AdminProjectInput } from '../api/projects-api';

type EditProjectFormProps = {
    project: AdminProject;
    onSuccess: () => void;
    onCancel: () => void;
};

function projectToFormFields(project: AdminProject): AdminProjectInput {
    return {
        name: project.name,
        type: project.type,
        regionalProgram: project.regionalProgram,
        impact: project.impact,
        phase: project.phase,
        status: project.status,
    };
}

export default function EditProjectForm({ project, onSuccess, onCancel }: EditProjectFormProps) {
    const [formData, setFormData] = useState<AdminProjectInput>(() => projectToFormFields(project));
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setFormData(projectToFormFields(project));
    }, [project]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        updateAdminProject(project.id, formData)
            .then(() => onSuccess())
            .catch((err) => setError(err instanceof Error ? err.message : 'Save failed'))
            .finally(() => setSubmitting(false));
    };

    return (
        <div className="card mb-4">
            <div className="card-header">Edit project #{project.id}</div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    <div className="mb-2 text-muted small">ID: {project.id}</div>
                    <div className="row g-2">
                        {(
                            [
                                ['name', 'Name'],
                                ['type', 'Type'],
                                ['regionalProgram', 'Regional Program'],
                                ['impact', 'Impact'],
                                ['phase', 'Phase'],
                                ['status', 'Status'],
                            ] as const
                        ).map(([name, label]) => (
                            <div className="col-md-6" key={name}>
                                <label className="form-label" htmlFor={`edit-${project.id}-${name}`}>
                                    {label}
                                </label>
                                <input
                                    id={`edit-${project.id}-${name}`}
                                    className="form-control"
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 d-flex gap-2">
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Saving…' : 'Save'}
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
