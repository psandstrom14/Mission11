/**
 * Category checkboxes. "Lifted state" pattern: no internal selection — parent owns selectedCategories
 * and passes updates via onSelectionChange (Mission 12 / video pattern).
 */
type CategoryFilterProps = {
    categories: string[];
    selectedCategories: string[];
    onSelectionChange: (next: string[]) => void;
};

export default function CategoryFilter({
    categories,
    selectedCategories,
    onSelectionChange,
}: CategoryFilterProps) {
    const toggleCategory = (name: string) => {
        const isSelected = selectedCategories.includes(name);
        const next = isSelected
            ? selectedCategories.filter((c) => c !== name)
            : [...selectedCategories, name];
        onSelectionChange(next);
    };

    return (
        <div className="mb-3">
            <div className="fw-semibold mb-2">Categories</div>
            <div className="d-flex flex-wrap gap-3">
                {categories.map((cat) => (
                    <div key={cat} className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={`category-${cat}`}
                            checked={selectedCategories.includes(cat)}
                            onChange={() => toggleCategory(cat)}
                        />
                        <label
                            className="form-check-label"
                            htmlFor={`category-${cat}`}
                        >
                            {cat}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}
