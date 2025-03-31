import { useEffect, useRef, useState } from 'react';
import { useSettingsStore } from '../../states/settingsStore';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

const SettingsPanel = () => {
  const isOpen = useSettingsStore((s) => s.isOpen);
  const close = useSettingsStore((s) => s.close);
  const mockFabricCount = useSettingsStore((s) => s.mockFabricCount);
  const setMockFabricCount = useSettingsStore((s) => s.setMockFabricCount);
  const thickerGrid = useSettingsStore((s) => s.thickerGrid);
  const setThickerGrid = useSettingsStore((s) => s.setThickerGrid);

  const [activeTab, setActiveTab] = useState<
    'Display' | 'Symbols' | 'Advanced'
  >('Display');
  const [animating, setAnimating] = useState(false);
  const [rendered, setRendered] = useState(false);

  // Local temp values
const [tempFabricCount, setTempFabricCount] = useState('');
const [tempGridSetting, setTempGridSetting] = useState(false);
const [hydrated, setHydrated] = useState(false);


  const modalRef = useRef<HTMLDivElement>(null);

  // Animate open/close
 useEffect(() => {
   if (isOpen) {
     setRendered(true);
     requestAnimationFrame(() => setAnimating(true));
     setTempFabricCount(mockFabricCount);
     setTempGridSetting(thickerGrid);
     setHydrated(true);
   } else {
     setAnimating(false);
     setHydrated(false);
     const timeout = setTimeout(() => setRendered(false), 150);
     return () => clearTimeout(timeout);
   }
 }, [isOpen, mockFabricCount, thickerGrid]);


  // Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleCancel();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  // Auto focus
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const first = modalRef.current.querySelector(
        'select, input, button'
      ) as HTMLElement;
      first?.focus();
    }
  }, [isOpen]);

  if (!rendered) return null;

  const tabs: ('Display' | 'Symbols' | 'Advanced')[] = [
    'Display',
    'Symbols',
    'Advanced',
  ];

const isDirty =
  hydrated &&
  (tempFabricCount !== mockFabricCount || tempGridSetting !== thickerGrid);


  const handleCancel = () => {
    if (isDirty) {
      const confirmClose = confirm('You have unapplied changes. Close anyway?');
      if (!confirmClose) return;
    }
    close();
  };

  const handleApply = () => {
    setMockFabricCount(tempFabricCount);
    setThickerGrid(tempGridSetting);
    close();
  };

  return createPortal(
    <div
      className={clsx(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-150',
        animating ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div
        ref={modalRef}
        className={clsx(
          'w-[600px] h-[500px] flex flex-col rounded-lg bg-white shadow-2xl transform transition-all duration-150',
          animating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        {/* Header */}
        <div className="flex items-center border-b p-4">
          <h2
            id="settings-title"
            className="text-xl font-semibold text-gray-800"
          >
            Settings
          </h2>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Tabs */}
          <div className="w-40 border-r p-4 bg-gray-50">
            <ul className="space-y-2 text-sm">
              {tabs.map((tab) => (
                <li
                  key={tab}
                  className={`cursor-pointer ${
                    activeTab === tab
                      ? 'font-bold text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 text-sm text-gray-800">
            {activeTab === 'Display' && (
              <>
                <label className="block mb-4">
                  <span className="block mb-1">Fabric Count</span>
                  <select
                    className="w-full rounded border px-2 py-1"
                    value={tempFabricCount}
                    onChange={(e) => setTempFabricCount(e.target.value)}
                  >
                    <option value="14">14 ct</option>
                    <option value="16">16 ct</option>
                    <option value="18">18 ct</option>
                  </select>
                </label>

                <label className="flex items-center gap-2 text-gray-800">
                  <input
                    type="checkbox"
                    checked={tempGridSetting}
                    onChange={(e) => setTempGridSetting(e.target.checked)}
                  />
                  Show thicker grid lines
                </label>
              </>
            )}

            {activeTab !== 'Display' && (
              <p className="text-gray-500 italic">
                Settings for "{activeTab}" not yet implemented.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t p-4 bg-gray-50">
          <button
            onClick={handleCancel}
            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!isDirty}
            className={clsx(
              'rounded px-4 py-2 text-sm text-white',
              isDirty
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            )}
          >
            Apply
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SettingsPanel;
