'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { 
  Download, 
  Trash2, 
  Shield, 
  AlertTriangle,
  Eye,
  Clock
} from 'lucide-react';

interface ChatPrivacyControlsProps {
  onExport: () => Promise<void>;
  onDeleteAll: () => Promise<void>;
  messageCount: number;
  lastActivity?: Date;
}

export function ChatPrivacyControls({ 
  onExport, 
  onDeleteAll, 
  messageCount,
  lastActivity 
}: ChatPrivacyControlsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      await onDeleteAll();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Overview Card */}
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-gold/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-gold" />
            <div>
              <CardTitle className="text-xl text-gold font-cinzel">
                Chat Privacy & Data
              </CardTitle>
              <CardDescription className="text-slate-300">
                Manage your conversation history and data
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-300 text-sm mb-1">
                <Eye className="w-4 h-4" />
                Total Messages
              </div>
              <div className="text-2xl font-bold text-gold">{messageCount}</div>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-300 text-sm mb-1">
                <Clock className="w-4 h-4" />
                Last Activity
              </div>
              <div className="text-sm text-slate-300">
                {lastActivity ? lastActivity.toLocaleDateString() : 'No activity'}
              </div>
            </div>
          </div>

          {/* Privacy Info */}
          <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
            <h4 className="text-sm font-medium text-slate-300 mb-2">Privacy Information</h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Your conversations are encrypted and stored securely</li>
              <li>• Only you can access your chat history</li>
              <li>• Data is used only to improve your personal experience</li>
              <li>• You can export or delete your data at any time</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Actions Card */}
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-gold/20">
        <CardHeader>
          <CardTitle className="text-lg text-gold font-cinzel">
            Data Management
          </CardTitle>
          <CardDescription className="text-slate-300">
            Export or delete your conversation history
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Export */}
          <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <div>
              <h4 className="text-sm font-medium text-slate-300">Export Chat History</h4>
              <p className="text-xs text-slate-400 mt-1">
                Download all your conversations as a JSON file
              </p>
            </div>
            <Button
              onClick={handleExport}
              disabled={isExporting || messageCount === 0}
              variant="outline"
              size="sm"
              className="border-gold/30 text-gold hover:bg-gold/10"
            >
              {isExporting ? (
                <>Exporting...</>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </>
              )}
            </Button>
          </div>

          {/* Delete */}
          <div className="flex items-center justify-between p-4 bg-red-900/20 rounded-lg border border-red-700/30">
            <div>
              <h4 className="text-sm font-medium text-red-300">Delete All Chat History</h4>
              <p className="text-xs text-red-400 mt-1">
                Permanently remove all your conversations. This cannot be undone.
              </p>
            </div>
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting || messageCount === 0}
              variant="outline"
              size="sm"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-red-500/30 rounded-lg p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-semibold text-red-300">Confirm Deletion</h3>
            </div>
            
            <p className="text-slate-300 text-sm mb-6">
              Are you sure you want to delete all your chat history? This will permanently remove 
              <strong className="text-red-300"> {messageCount} messages</strong> and cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAll}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? 'Deleting...' : 'Delete All'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
} 