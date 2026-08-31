import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'checkbox' | 'csv' | 'select';
  options?: string[]; // for 'select'
  required?: boolean;
  placeholder?: string;
}

interface AdminManagerProps<T extends { id?: string }> {
  title: string;
  fields: FieldConfig[];
  fetchAll: () => Promise<T[]>;
  upsert: (item: any) => Promise<void>;
  remove: (id: string) => Promise<void>;
  posterKey?: string; // which field holds the thumbnail image, for the list view
  titleKey?: string; // which field holds the display name in the list view
}

export function AdminManager<T extends { id?: string; [k: string]: any }>({
  title,
  fields,
  fetchAll,
  upsert,
  remove,
  posterKey = 'poster',
  titleKey = 'title',
}: AdminManagerProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<T> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetchAll()
      .then(setItems)
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startNew = () => {
    const blank: any = {};
    fields.forEach((f) => {
      blank[f.key] = f.type === 'checkbox' ? false : f.type === 'number' ? 0 : '';
    });
    setEditing(blank);
    setError(null);
  };

  const startEdit = (item: T) => {
    const copy: any = { ...item };
    fields.forEach((f) => {
      if (f.type === 'csv' && Array.isArray(copy[f.key])) {
        copy[f.key] = copy[f.key].join(', ');
      }
    });
    setEditing(copy);
    setError(null);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const payload: any = { ...editing };
      fields.forEach((f) => {
        if (f.type === 'csv' && typeof payload[f.key] === 'string') {
          payload[f.key] = payload[f.key]
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean);
        }
        if (f.type === 'number') {
          payload[f.key] = Number(payload[f.key]) || 0;
        }
      });
      if (!payload.id) delete payload.id; // let DB generate it
      await upsert(payload);
      setEditing(null);
      load();
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    try {
      await remove(id);
      load();
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white font-sans">{title}</h3>
        <button
          onClick={startNew}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black text-xs font-mono font-semibold hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add New
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-400 font-mono text-sm">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-10 text-gray-400 font-mono text-sm">No items yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
            >
              {item[posterKey] && (
                <img
                  src={item[posterKey]}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-black/40"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-sans truncate">{item[titleKey]}</p>
                <p className="text-[10px] text-gray-500 font-mono truncate">{item.id}</p>
              </div>
              <button
                onClick={() => startEdit(item)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white flex-shrink-0"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(item.id!)}
                className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 flex-shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-[#1a1a1a] border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white font-sans">
                {editing.id ? 'Edit' : 'Add'} {title.replace(/s$/, '')}
              </h4>
              <button
                onClick={() => setEditing(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {fields.map((f) => (
                <div key={f.key} className="space-y-1">
                  <label className="text-[11px] font-mono text-gray-400 uppercase">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      value={(editing as any)[f.key] ?? ''}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value } as any)}
                      placeholder={f.placeholder}
                      rows={3}
                      className="w-full bg-[#141313] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
                    />
                  ) : f.type === 'checkbox' ? (
                    <input
                      type="checkbox"
                      checked={!!(editing as any)[f.key]}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.checked } as any)}
                      className="w-4 h-4"
                    />
                  ) : f.type === 'select' ? (
                    <select
                      value={(editing as any)[f.key] ?? ''}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value } as any)}
                      className="w-full bg-[#141313] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                    >
                      {(f.options ?? []).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type === 'number' ? 'number' : 'text'}
                      value={(editing as any)[f.key] ?? ''}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value } as any)}
                      placeholder={f.placeholder}
                      className="w-full bg-[#141313] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white text-black text-sm font-mono font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
