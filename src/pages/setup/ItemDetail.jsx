import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  PageShell,
} from "../../components/layout/PageShell.jsx";
import axiosInstance from "../../services/axiosInstance.js";
import { MdArrowBack, MdRefresh } from "react-icons/md";

const BASE_URL = import.meta.env.VITE_UPLOADS_URL || "http://localhost:5000";

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 shrink-0">
        {label}
      </span>
      <span className="text-[12px] font-medium text-slate-800 dark:text-slate-200 text-right truncate ml-2">
        {value || "-"}
      </span>
    </div>
  );
}

function DetailSection({ title, icon, children, color = "teal", className = "" }) {
  const accent = {
    teal: "bg-teal-500", sky: "bg-sky-500", violet: "bg-violet-500",
    emerald: "bg-emerald-500", amber: "bg-amber-500",
  };
  const header = {
    teal: "border-teal-100 bg-teal-50/80", sky: "border-sky-100 bg-sky-50/80",
    violet: "border-violet-100 bg-violet-50/80", emerald: "border-emerald-100 bg-emerald-50/80",
    amber: "border-amber-100 bg-amber-50/80",
  };
  return (
    <div className={`bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden ${className}`}>
      <div className={`flex items-center gap-1.5 border-b px-3 py-2 ${header[color] || header.teal} dark:bg-teal-600 dark:border-teal-500/50`}>
        <span className={`h-2.5 w-1 rounded-full ${accent[color] || accent.teal} dark:bg-white`} />
        {icon && <span className="text-slate-600 dark:text-white text-sm">{icon}</span>}
        <h3 className="text-[11px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">{title}</h3>
      </div>
      <div className="space-y-1.5 p-3">{children}</div>
    </div>
  );
}

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchItem(); }, [id]);

  async function fetchItem() {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/item-details/${id}`);
      setItem(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load item.");
      navigate("/items", { replace: true });
    } finally { setLoading(false); }
  }

  if (loading) {
    return (
      <PageShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
            <p className="text-sm font-medium">Loading item details...</p>
          </div>
        </div>
      </PageShell>
    );
  }

  if (!item) return null;

  const isActive = item.isEnable === 1 || item.isEnable === true || item.is_enable === 1 || item.is_enable === true;

  const imgSrc = item.item_image_url
    ? item.item_image_url.startsWith("http") ? item.item_image_url : `${BASE_URL}${item.item_image_url}`
    : null;

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : null;

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-6xl space-y-3">
        {/* ── Header ── */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden">
          <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
            <div className="min-w-0 space-y-1 flex-1">
              <button
                onClick={() => navigate("/items")}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-teal-600 transition-colors mb-1.5"
              >
                <MdArrowBack className="h-3.5 w-3.5" />
                Back to Items
              </button>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 truncate max-w-full">
                  {item.itemName || item.item_name}
                </h1>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest shrink-0 ${isActive ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300" : "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-teal-500" : "bg-rose-500"}`} />
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                <span>{item.label_barcode || item.barCode || "No Barcode"}</span>
                {item.category_name && <span className="hidden xs:inline">|</span>}
                {item.category_name && <span className="text-slate-500 dark:text-slate-400">{item.category_name}</span>}
              </div>
            </div>
            <button
              type="button"
              onClick={fetchItem}
              className="rounded-sm border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <MdRefresh className="inline mr-1" /> Refresh
            </button>
          </div>
          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 px-4 sm:px-5 py-2 text-[10px] text-slate-400 dark:text-slate-500">
            {fmtDate(item.created_at) && (
              <span>Created <span className="font-medium text-slate-600 dark:text-slate-300">{fmtDate(item.created_at)}</span></span>
            )}
            {fmtDate(item.updated_at) && (
              <span>Updated <span className="font-medium text-slate-600 dark:text-slate-300">{fmtDate(item.updated_at)}</span></span>
            )}
            <span>ID <span className="font-mono font-medium text-slate-600 dark:text-slate-300">{item.id}</span></span>
          </div>
        </div>

        {/* ── Image ── */}
        {imgSrc && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
            <div className="flex items-center justify-center py-4">
              <img
                src={imgSrc}
                alt={item.itemName || item.item_name}
                className="max-h-48 sm:max-h-64 max-w-full rounded-lg object-contain shadow"
              />
            </div>
          </div>
        )}

        {/* ── Classification + Pricing + Stock grid ── */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <DetailSection title="Classification" color="teal" icon={<MdArrowBack className="h-3.5 w-3.5 rotate-90" />}>
            <DetailRow label="Sub-category" value={item.sub_category_name} />
            <DetailRow label="Item type" value={item.type_name} />
            <DetailRow label="Manufacturer" value={item.manufacturer_name} />
            <DetailRow label="Supplier" value={item.supplier_name} />
          </DetailSection>
          <DetailSection title="Pricing" color="amber" icon={<span className="text-[11px]">PKR</span>}>
            <DetailRow label="Purchase price" value={item.purchasePrice || item.purchase_price ? `${Number(item.purchasePrice || item.purchase_price).toLocaleString()} PKR` : "-"} />
            <DetailRow label="Sale price" value={item.salePrice || item.sale_price ? `${Number(item.salePrice || item.sale_price).toLocaleString()} PKR` : "-"} />
          </DetailSection>
          <DetailSection title="Stock & Unit" color="emerald" icon={<span className="text-[13px]">#</span>}>
            <DetailRow label="Current stock" value={String(item.stock ?? item.opening_stock ?? 0)} />
            <DetailRow label="Reorder level" value={String(item.reorder ?? item.reorder_level ?? 0)} />
            <DetailRow label="Unit" value={item.unit_name} />
            <DetailRow label="Per pack" value={String(item.perUnit ?? item.per_unit ?? 1)} />
          </DetailSection>
        </div>

        {/* ── Location + Description ── */}
        <div className="grid gap-3 sm:grid-cols-2">
          <DetailSection title="Location" color="violet">
            <DetailRow label="Shelf / Location" value={item.shelf_name_code} />
          </DetailSection>
          <DetailSection title="Description" color="sky" className="sm:col-span-1">
            <div className="rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2">
              <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap line-clamp-4">
                {item.details || "No description provided."}
              </p>
            </div>
          </DetailSection>
        </div>
      </div>
    </PageShell>
  );
}
