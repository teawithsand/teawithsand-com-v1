<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ApiAdminController extends AbstractController
{
    #[Route('/admin', name: 'api_admin')]
    public function index(): Response
    {
        return $this->render('api_admin/index.html.twig', [
            'controller_name' => 'ApiAdminController',
        ]);
    }
}
