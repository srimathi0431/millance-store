import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../../config/app_colors.dart';
import 'qr_payment_confirm_screen.dart';

class QRScanPayScreen extends StatefulWidget {
  const QRScanPayScreen({super.key});

  @override
  State<QRScanPayScreen> createState() => _QRScanPayScreenState();
}

class _QRScanPayScreenState extends State<QRScanPayScreen> {
  MobileScannerController cameraController = MobileScannerController();
  String? scannedData;
  bool _useCamera = true;

  @override
  void dispose() {
    cameraController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: const Text('Scan QR Code'),
        backgroundColor: AppColors.forestGreen,
        actions: [
          IconButton(
            icon: Icon(_useCamera ? Icons.image : Icons.camera_alt),
            onPressed: () {
              setState(() => _useCamera = !_useCamera);
            },
          ),
          IconButton(
            icon: const Icon(Icons.flash_off),
            onPressed: () => cameraController.toggleTorch(),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            flex: 4,
            child: _useCamera
                ? _buildCameraView()
                : _buildImagePickerView(),
          ),
          Expanded(
            flex: 1,
            child: _buildBottomPanel(),
          ),
        ],
      ),
    );
  }

  Widget _buildCameraView() {
    return MobileScanner(
      controller: cameraController,
      onDetect: (capture) {
        final List<Barcode> barcodes = capture.barcodes;
        if (barcodes.isNotEmpty && scannedData == null) {
          final barcode = barcodes.first;
          if (barcode.rawValue != null) {
            setState(() {
              scannedData = barcode.rawValue;
            });
            cameraController.stop();
            _navigateToConfirmation();
          }
        }
      },
    );
  }

  Widget _buildImagePickerView() {
    return Container(
      color: Colors.grey[900],
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.qr_code_scanner,
              size: 100,
              color: Colors.grey[700],
            ),
            const SizedBox(height: 24),
            Text(
              'Upload QR Code Image',
              style: TextStyle(
                fontSize: 18,
                color: Colors.grey[400],
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _pickImageAndScan,
              icon: const Icon(Icons.upload_file),
              label: const Text('Choose from Gallery'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.forestGreen,
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomPanel() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          if (scannedData != null) ...[
            Row(
              children: [
                const Icon(
                  Icons.check_circle,
                  color: AppColors.success,
                ),
                const SizedBox(width: 8),
                const Text(
                  'QR Code Scanned',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: _navigateToConfirmation,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.forestGreen,
                minimumSize: const Size(double.infinity, 50),
              ),
              child: const Text('Continue to Payment'),
            ),
          ] else ...[
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.qr_code_scanner,
                  color: Colors.grey[600],
                  size: 20,
                ),
                const SizedBox(width: 8),
                Text(
                  _useCamera
                      ? 'Point camera at QR code to scan'
                      : 'Tap to upload QR code image',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Future<void> _pickImageAndScan() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);
    
    if (image != null) {
      // In a real implementation, you would use a QR code decoder library
      // For now, we'll simulate successful scan
      setState(() {
        scannedData = 'MILLANCE_STORE_QR';
      });
    }
  }

  void _navigateToConfirmation() {
    if (scannedData != null) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => QRPaymentConfirmScreen(qrData: scannedData!),
        ),
      );
    }
  }
}
