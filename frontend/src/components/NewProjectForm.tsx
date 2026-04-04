import { useState, type ChangeEvent, type FormEvent } from 'react';
import { createAdminProject, type AdminProjectInput } from '../api/projects-api';

const initialForm: AdminProjectInput = {
    name: '',
    type: '',
    regionalProgram: '',
    impact: '',
    phase: '',
    status: '',
};

type NewProjectFormProps = {
    onSuccess: () => void;
    onCancel: () => void;
};

export default function NewProjectForm({ onSuccess, onCancel }: NewProjectFormProps) {
    const [formData, setFormData] = useState<AdminProjectInput>(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        createAdminProject(formData)
            .then(() => onSuccess())
            .catch((err) => setError(err instanceof Error ? err.message : 'Save failed'))
            .finally(() => setSubmitting(false));
    };

    return (
        <div className="card mb-4">
            <div className="card-header">New project</div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    {error && <div className="alert alert-danger py-2">{error}</div>}
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
                                <label className="form-label" htmlFor={`new-${name}`}>
                                    {label}
                                </label>
                                <input
                                    id={`new-${name}`}
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
                            {submitting ? 'Saving…' : 'Create'}
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
