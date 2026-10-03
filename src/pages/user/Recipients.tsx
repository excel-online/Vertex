import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Plus, Building2, Wallet, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Recipient {
  id: string;
  name: string;
  type: 'Bank' | 'Crypto';
  details: string;
  accountNumber?: string;
}

const Recipients = () => {
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: '1', name: 'Rahman Abdullah', type: 'Bank', details: 'Guaranty Trust Bank •••• 4892' },
    { id: '2', name: 'USDT TRC20 Wallet', type: 'Crypto', details: 'TXyz89...3wQp' }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecipient, setNewRecipient] = useState({
    name: '',
    type: 'Bank' as 'Bank' | 'Crypto',
    details: ''
  });

  const handleAddRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient.name || !newRecipient.details) {
      toast.error('Please fill in all fields');
      return;
    }

    const recipient: Recipient = {
      id: Date.now().toString(),
      name: newRecipient.name,
      type: newRecipient.type,
      details: newRecipient.details
    };

    setRecipients(prev => [recipient, ...prev]);
    setNewRecipient({ name: '', type: 'Bank', details: '' });
    setShowAddModal(false);
    toast.success('Recipient added successfully!');
  };

  const handleDelete = (id: string) => {
    setRecipients(prev => prev.filter(r => r.id !== id));
    toast.success('Recipient removed');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between pt-4 pb-2 border-b border-white/5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/profile')}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Saved Recipients</h1>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white rounded-2xl px-4 py-2 text-sm font-semibold shadow-lg shadow-purple-600/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New
        </Button>
      </div>

      {/* Recipients List */}
      <div className="space-y-3">
        {recipients.length > 0 ? (
          recipients.map((recipient) => (
            <div 
              key={recipient.id}
              className="rounded-3xl bg-slate-900/80 border border-white/10 p-5 shadow-xl backdrop-blur-xl flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  recipient.type === 'Bank' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {recipient.type === 'Bank' ? <Building2 className="w-6 h-6" /> : <Wallet className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold text-base">{recipient.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-slate-300 border border-white/5">
                      {recipient.type}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5 font-mono">{recipient.details}</p>
                </div>
              </div>

              <button
                onClick={() => handleDelete(recipient.id)}
                className="w-10 h-10 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center transition-colors"
                aria-label="Delete recipient"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-16 rounded-3xl bg-slate-900/40 border border-white/5">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No saved recipients yet</p>
            <p className="text-slate-500 text-xs mt-1">Add a bank or crypto wallet for quick withdrawals.</p>
          </div>
        )}
      </div>

      {/* Add Recipient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="rounded-3xl bg-slate-900 border border-white/10 w-full max-w-md p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white">Add New Recipient</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRecipient} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Account Type</label>
                <select
                  value={newRecipient.type}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, type: e.target.value as 'Bank' | 'Crypto' }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="Bank" className="bg-slate-900">Bank Account</option>
                  <option value="Crypto" className="bg-slate-900">Crypto Wallet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Account Holder / Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={newRecipient.name}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  {newRecipient.type === 'Bank' ? 'Bank Name & Account Number' : 'Wallet Address'}
                </label>
                <input
                  type="text"
                  placeholder={newRecipient.type === 'Bank' ? 'GTBank •••• 1234' : 'TRC20 Wallet Address'}
                  value={newRecipient.details}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, details: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  variant="outline"
                  className="flex-1 rounded-2xl border-white/10 text-white hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Save Recipient
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Recipients;
