import { NextRequest, NextResponse } from "next/server";
import {isSessionValid} from "@/app/libs/session";

//Esse "matcher" se encontra na própria documentação do next e serve para filtrar arquivos que não devem ser afetados
export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
}

const publicRoutes = [
    '/',
    '/login',
    '/create'
];

export async function middleware(req: NextRequest){

    const pathname = req.nextUrl.pathname;

    if(publicRoutes.includes(pathname))
    {
        return NextResponse.next();
    }

    const session = await isSessionValid();
    //Caso não exista session, redirecionar para a página de login
    if(!session){
        return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
}