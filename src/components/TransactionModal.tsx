
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CodeListing } from "@/types";
import useWallet from "@/hooks/useWallet";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  listing: CodeListing;
  isProcessing: boolean;
  error?: string | null;
}

const TransactionModal = ({
  isOpen,
  onClose,
  onConfirm,
  listing,
  isProcessing,
  error
}: TransactionModalProps) => {
  const { formatAddress } = useWallet();

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error: any) {
      console.error("Transaction error:", error);
      toast.error("Transaction failed. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-dark sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Purchase</DialogTitle>
          <DialogDescription className="text-codemarket-text-muted">
            You are about to purchase the following code:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-codemarket-darker p-4 rounded-md">
            <div className="flex justify-between mb-2">
              <span className="text-codemarket-text-muted">Item:</span>
              <span className="font-medium">{listing.title}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-codemarket-text-muted">Price:</span>
              <span className="font-medium text-codemarket-accent">{listing.price} ETH</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-codemarket-text-muted">Seller:</span>
              <span className="font-mono text-sm">{formatAddress(listing.sellerAddress)}</span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-sm text-codemarket-text-muted">
            <p>
              By confirming this transaction, you agree to the marketplace terms and
              conditions. This transaction cannot be reversed once completed.
            </p>
            <p className="mt-2">
              A MetaMask window will open to confirm the transaction. Please
              check all details before confirming.
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="sm:w-1/2 border-codemarket-muted"
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="sm:w-1/2 bg-codemarket-accent hover:bg-codemarket-accent-hover"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              "Confirm & Pay"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
