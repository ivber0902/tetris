<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class ErrorController extends AbstractController
{
    public function show(\Throwable $exception): Response
    {
        $message = $exception->getMessage();
        $code = $exception instanceof HttpExceptionInterface ? $exception->getStatusCode() : Response::HTTP_INTERNAL_SERVER_ERROR;
        switch ($code) {
            case 400:
                $message = "Неверный запрос";
                break;
            case 401:
                $message = "Пользователь не авторизован";
                break;
            case 404:
                $message = "Страница не найдена";
                break;
            case 500:
                $message = "Ошибка сервера";
                break;
        }
        return $this->render('error.html.twig', [
            "code" => $code,
            "message" => $message
        ]);
    }
}