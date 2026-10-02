import { BranchOption, BusinessContext } from "../../../apiservice/staff-service";

type Props = {
  /**
   * Logged-in pages: the user's business context. Super Admin / General Admin get the
   * dropdown; everyone else is locked to their branch and sees it as a fixed label.
   */
  business?: BusinessContext | null;
  /** Public pages (careers): a plain branch list, shown as a dropdown when there is more than one. */
  branches?: BranchOption[];
  /** "" means all branches. */
  value: number | "";
  onChange: (value: number | "") => void;
  className?: string;
};

const label = (branch: BranchOption) => `${branch.branch_name}${branch.city ? ` (${branch.city})` : ""}`;

export default function BranchFilter({ business, branches, value, onChange, className = "" }: Props) {
  if (business && !business.can_filter_branches) {
    const own = business.branches.find((branch) => branch.id === business.locked_branch_id);
    return own ? (
      <span
        className={`inline-flex h-10 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600 ${className}`}
        title="You can only see your own branch"
      >
        Branch: <span className="ml-1 font-medium text-slate-800">{own.branch_name}</span>
      </span>
    ) : null;
  }

  const options = business ? business.branches : branches;
  if (!options || (!business && options.length <= 1)) return null;

  return (
    <select
      aria-label="Branch"
      value={value}
      onChange={(event) => onChange(event.target.value === "" ? "" : Number(event.target.value))}
      className={`h-10 rounded-lg border border-slate-300 bg-white px-2 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100 ${className}`}
    >
      <option value="">All branches</option>
      {options.map((branch) => (
        <option key={branch.id} value={branch.id}>
          {label(branch)}
        </option>
      ))}
    </select>
  );
}
