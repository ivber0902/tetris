<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DebugController extends AbstractController
{
    /**
     * @Route("/debug/env", name="debug_env")
     */
    public function debugEnv(): Response
    {
        $mongodbUrl = getenv('MONGODB_URL');
        $mongodbDb = getenv('MONGODB_DB');

        return new Response(sprintf('MONGODB_URL: %s, MONGODB_DB: %s', $mongodbUrl, $mongodbDb));
    }
}
