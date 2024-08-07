<?php
declare(strict_types=1);

namespace App\Service;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use App\Service\ImageServiceInterface;
use PhpParser\Node\Expr\Cast\Object_;

class ImageService{
    const UPLOADS_PATH = DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'uploads';
    const ALLOWED_MIME_TYPES_MAP = [
        'image/jpeg' => '.jpg',
        'image/png' => '.png',
        'image/webp' => '.webp',
    ];
    public function deleteImage(string $pathImage): void
    {
        unlink(dirname(__DIR__, 2) . self::UPLOADS_PATH. '/' . $pathImage);
    }

    public function updateImage(?string $pathImage, Object $imageObject): ?string
    {
        if ($imageObject !== null)
        {
            $fileInfo = [
                'type' => $imageObject->getClientMimeType(),
                'name' => $imageObject->getFilename(),
                'tmp_name' => $imageObject->getPathname(),
                'error' => $imageObject->getError(),
            ];
        }
        if($pathImage !== null){
            $this->deleteImage($pathImage);
        }
        return  $this->moveImageToUploads($fileInfo);
    }

    public function moveImageToUploads(array $fileInfo): ?string
    {
        if ($fileInfo['error'] === UPLOAD_ERR_NO_FILE)
        {
            return null;
        }

        $fileName = $fileInfo['name'];
        $fileType = $fileInfo['type'];
        $imageExt = self::ALLOWED_MIME_TYPES_MAP[$fileType] ?? null;
   
        if (!$imageExt) {
            throw new \InvalidArgumentException("File '$fileName' has non-image type '$fileType'");
        }

        $destFileName = uniqid('image', true) . $imageExt;
        return $this->moveFileToUploads($fileInfo, $destFileName);
    }



    private function getUploadPath(string $fileName): string
    {
        $uploadsPath = dirname(__DIR__, 2) . self::UPLOADS_PATH;

        if (!$uploadsPath || !is_dir($uploadsPath)) {
            throw new \RuntimeException('Invalid uploads path: ' . self::UPLOADS_PATH);
        }

        return $uploadsPath . DIRECTORY_SEPARATOR . $fileName;
        }

    private function moveFileToUploads(array $fileInfo, string $destFileName): string
    {
        $fileName = $fileInfo['name'];
        $destPath = $this->getUploadPath($destFileName);
        $srcPath = $fileInfo['tmp_name'];
        if (!@move_uploaded_file($srcPath, $destPath)) {
            throw new \RuntimeException("Failed to upload file $fileName");
        }
   
        return $destFileName;
    }



}