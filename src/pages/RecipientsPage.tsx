import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Wallet, Trash2, Building2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Recipient {
  id: string;
  name: string;
  type: 'Crypto' | 'Bank';
  address: string;
  network: string;
  isDefault: boolean;
}

const RecipientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState<Recipient[]>([
    {
      id: '1',
      name: 'Main USDT Wallet (TRC20)',
      type: 'Crypto',
      address: 'TYDza2...8xK9pL',
      network: 'Tron (TRC20)',
      isDefault: true,
    },
    {
      id: '2',
      name: 'Personal Bank Account',
      type: 'Bank',
      address: '0123456789 • Access Bank',
      network: 'Wire / Fiat',
      isDefault: false,
    }
  ]);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newRecipient, setNewRecipient] = useState({
    name: '',
    type: 'Crypto' as 'Crypto' | 'Bank',
    address: '',
    network: 'Tron (TRC20)',
  });

  const handleAddRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient.name || !newRecipient.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    const item: Recipient = {
      id: Date.now().toString(),
      ...newRecipient,
      isDefault: recipients.length === 0,
    };

    setRecipients([item, ...recipients]);
    setShowAddModal(false);
    setNewRecipient({ name: '', type: 'Crypto', address: '', network: 'Tron (TRC20)' });
    toast.success('Recipient added successfully');
  };

  const handleDelete = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id));
    toast.success('Recipient removed');
  };

  const handleSetDefault = (id: string) => {
    setRecipients(recipients.map(r => ({
      ...r,
      isDefault: r.id === id
    })));
    toast.success('Default payout destination updated');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 pb-20">
      
      {/* Header bar */}
      <div className="flex items-center justify-between pt-4 pb-2 border-b border-white/5">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-white tracking-tight">Recipients</h1>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-2xl flex items-center gap-2 text-sm font-semibold transition-all shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Recipient
        </button>
      </div>

      {/* Intro info */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-5 shadow-xl backdrop-blur-xl">
        <p className="text-slate-400 text-sm">
          Manage your saved wallet addresses and payout bank accounts for fast, secure withdrawals without needing to re-enter details every time.
        </p>
      </div>

      {/* Recipient list */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2">Saved Accounts & Wallets ({recipients.length})</p>
        
        {recipients.length === 0 ? (
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-12 text-center space-y-3">
            <Wallet className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-white font-medium">No recipients saved yet</p>
            <p className="text-slate-400 text-xs">Add a crypto wallet or bank account to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recipients.map((recipient) => (
              <div 
                key={recipient.id}
                className="rounded-3xl bg-slate-900/80 border border-white/10 p-5 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-purple-500/30"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    recipient.type === 'Crypto' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {recipient.type === 'Crypto' ? <Wallet className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-semibold text-sm">{recipient.name}</h3>
                      {recipient.isDefault && (
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-xs font-mono truncate">{recipient.address}</p>
                    <p className="text-slate-500 text-[11px]">{recipient.network}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {!recipient.isDefault && (
                    <button
                      onClick={() => handleSetDefault(recipient.id)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-medium transition-all cursor-pointer"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(recipient.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD RECIPIENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="rounded-3xl bg-slate-900 border border-white/10 w-full max-w-md p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white">Add New Recipient</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRecipient} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Recipient / Label Name</label>
                <input
                  type="text"
                  placeholder="e.g. My Binance USDT Wallet"
                  value={newRecipient.name}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Account Type</label>
                <select
                  value={newRecipient.type}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, type: e.target.value as 'Crypto' | 'Bank' }))}
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="Crypto">Crypto Wallet</option>
                  <option value="Bank">Bank Account</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Wallet Address / Account Number</label>
                <input
                  type="text"
                  placeholder="e.g. TYDza2... or Bank Account Number"
                  value={newRecipient.address}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Network / Provider</label>
                <input
                  type="text"
                  placeholder="e.g. Tron (TRC20) or Access Bank"
                  value={newRecipient.network}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, network: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  variant="outline"
                  className="flex-1 rounded-2xl border-white/10 text-white hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer"
                >
                  Save Recipient
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RecipientsPage;
