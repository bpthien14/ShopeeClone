import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'

interface DeleteProductDialogProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    productName: string
}

export default function DeleteProductDialog({ open, onClose, onConfirm, productName }: DeleteProductDialogProps) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want to delete "{productName}"? This action cannot be undone.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}