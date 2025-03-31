import { useSettingsStore } from '../../states/settingsStore';

const SettingsPanel = () => {
  const isOpen = useSettingsStore((s) => s.isOpen);
  const close = useSettingsStore((s) => s.close);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[600px] rounded-lg bg-white p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button
            className="text-sm text-red-500 hover:underline"
            onClick={() => {
              const confirmClose = confirm(
                'You have unapplied changes. Close anyway?'
              );
              if (confirmClose) close();
            }}
          >
            Close
          </button>
        </div>

        <div className="flex">
          {/* Placeholder vertical tabs */}
          <div className="w-40 border-r pr-4">
            <ul className="space-y-2 text-sm">
              <li className="font-bold text-blue-600">Display</li>
              <li className="text-gray-400">Symbols</li>
              <li className="text-gray-400">Advanced</li>
            </ul>
          </div>

          {/* Placeholder content */}
          <div className="flex-1 pl-6 space-y-4">
            <label className="block text-sm">
              <span className="block mb-1">Fabric Count</span>
              <select className="w-full rounded border px-2 py-1">
                <option value="14">14 ct</option>
                <option value="16">16 ct</option>
                <option value="18">18 ct</option>
              </select>
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" />
              Show thicker grid lines
            </label>

            <button
              onClick={() => {
                console.log('Apply settings');
                close();
              }}
              className="mt-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
