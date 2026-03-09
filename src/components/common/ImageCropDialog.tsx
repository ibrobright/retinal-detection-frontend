import React, { useState, useCallback } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Slider,
    Typography,
    IconButton,
    CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CropIcon from '@mui/icons-material/Crop';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import { getCroppedImg, PixelCrop } from '@/utils/cropImage';
import { med } from '@/styles/themes/theme';

interface ImageCropDialogProps {
    /** Whether the dialog is open */
    open: boolean;
    /** The image source URL (object URL or data URL) */
    imageSrc: string;
    /** Original file name — used to name the cropped file */
    fileName: string;
    /** Original MIME type */
    mimeType?: string;
    /** Called when the user confirms the crop */
    onCropComplete: (croppedFile: File) => void;
    /** Called when the dialog is closed / cancelled */
    onClose: () => void;
}

export const ImageCropDialog: React.FC<ImageCropDialogProps> = ({
    open,
    imageSrc,
    fileName,
    mimeType = 'image/jpeg',
    onCropComplete,
    onClose,
}) => {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
    const [processing, setProcessing] = useState(false);

    const onCropChange = useCallback((location: Point) => {
        setCrop(location);
    }, []);

    const onZoomChange = useCallback((z: number) => {
        setZoom(z);
    }, []);

    const handleCropComplete = useCallback((_croppedArea: Area, croppedPixels: Area) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleConfirm = async () => {
        if (!croppedAreaPixels) return;

        setProcessing(true);
        try {
            const croppedFile = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                fileName,
                mimeType,
            );
            onCropComplete(croppedFile);
        } catch (err) {
            console.error('Crop failed:', err);
        } finally {
            setProcessing(false);
        }
    };

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    /** Reset state when dialog closes so it's fresh next time */
    const handleClose = () => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setCroppedAreaPixels(null);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    overflow: 'hidden',
                },
            }}
        >
            {/* ── Header ── */}
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 2,
                    px: 3,
                    borderBottom: `1px solid ${med.border}`,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CropIcon sx={{ color: med.primary, fontSize: 22 }} />
                    <Typography variant="h6" fontWeight={700}>
                        Crop Image
                    </Typography>
                </Box>
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            {/* ── Crop Area ── */}
            <DialogContent
                sx={{
                    p: 0,
                    position: 'relative',
                    backgroundColor: '#111',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Cropper canvas */}
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: { xs: 320, sm: 420, md: 480 },
                    }}
                >
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={undefined} // free-form crop
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onCropComplete={handleCropComplete}
                        style={{
                            containerStyle: {
                                width: '100%',
                                height: '100%',
                            },
                        }}
                    />
                </Box>

                {/* ── Controls ── */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        px: 3,
                        py: 2,
                        backgroundColor: med.surface,
                        borderTop: `1px solid ${med.border}`,
                    }}
                >
                    {/* Zoom slider */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                        <ZoomInIcon sx={{ color: med.muted, fontSize: 20 }} />
                        <Typography variant="caption" sx={{ color: med.muted, minWidth: 36 }}>
                            Zoom
                        </Typography>
                        <Slider
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            onChange={(_e, v) => setZoom(v as number)}
                            sx={{
                                flex: 1,
                                '& .MuiSlider-thumb': {
                                    width: 16,
                                    height: 16,
                                },
                            }}
                        />
                        <Typography variant="caption" sx={{ color: med.muted, minWidth: 32, textAlign: 'right' }}>
                            {zoom.toFixed(1)}×
                        </Typography>
                    </Box>

                    {/* Rotate button */}
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<RotateRightIcon />}
                        onClick={handleRotate}
                        sx={{
                            minWidth: 'auto',
                            px: 2,
                            borderColor: med.border,
                            color: med.muted,
                            '&:hover': {
                                borderColor: med.primary,
                                color: med.primary,
                                backgroundColor: med.primaryLight,
                            },
                        }}
                    >
                        Rotate
                    </Button>
                </Box>
            </DialogContent>

            {/* ── Actions ── */}
            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    borderTop: `1px solid ${med.border}`,
                }}
            >
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    disabled={processing}
                    sx={{ px: 3 }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={processing || !croppedAreaPixels}
                    startIcon={
                        processing ? (
                            <CircularProgress size={18} color="inherit" />
                        ) : (
                            <CropIcon />
                        )
                    }
                    sx={{ px: 3 }}
                >
                    {processing ? 'Cropping…' : 'Apply Crop'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
