<?php

namespace App\Controller;

use App\Controller\Input\RegisterUserInput;
use App\Service\PlayerService;
use App\Service\UserService;
use Symfony\Component\HttpFoundation\Request;
use \Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class UserController extends AbstractController
{
    public function __construct(
        private readonly UserService $userService
    )
    {
    }

    public function index(Request $request): Response
    {
        var_dump($this->getUser());
        return $this->render('index.html.twig');
    }
    public function register(Request $request): Response
    {
        $input = new RegisterUserInput();
        $form = $this->createForm(RegisterUserInput::class, $input, [
            'action' => $this->generateUrl('register'),
        ]);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid())
        {
            $input = $form->getData();
            $userId = $this->userService->register($input);

            return $this->redirectToRoute('login');
        }

        return $this->render('user/register.html.twig', [
            'form' => $form->createView(),
        ]);
    }
    public function registerByJson(Request $request): Response
    {
        $input = new RegisterUserInput();
        $form = $this->createForm(RegisterUserInput::class, $input);
        $form->handleRequest($request);

        try
        {
            if ($form->isSubmitted() && $form->isValid()) {
                $input = $form->getData();
                $userId = $this->userService->register($input);

                return $this->json([
                    "message" => "User successfully registered",
                    "userID" => $userId
                ], 200, ["Content-Type" => "application/json"]);
            } else {
                $formErrors = $form->getErrors();
                return $this->json([
                    "message" => $formErrors
                ], 400, ["Content-Type" => "application/json"]);
            }
        }
        catch (\InvalidArgumentException $exception)
        {
            return $this->json([
                "message" => $exception->getMessage()
            ], 400, ["Content-Type" => "application/json"]);
        }
    }
}