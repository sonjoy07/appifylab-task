import Image from "next/image";
import RegisterForm from "../components/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign Up" };

export default function Register() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="absolute inset-0 z-99 pointer-events-none select-none">       
        
        <div className="absolute top-0 -left-50 w-[500px] h-[300px] sm:w-[500px] sm:h-[500px]">
          <Image
            src="/shape1.svg" 
            alt="Top Left Graphic"
            fill
            priority
            className="object-contain object-top object-left"
          />
        </div>

        <div className="absolute top-0 right-0 w-[200px] h-[200px] sm:w-[480px] sm:h-[480px]">
          <Image
            src="/shape2.svg"
            alt="Top Right Graphic"
            fill
            priority
            className="object-contain object-top object-right"
          />
        </div>

        <div className="absolute bottom-0 right-0 w-[250px] h-[250px] sm:w-[500px] sm:h-[500px]">
          <Image
            src="/shape3.svg"
            alt="Bottom Right Graphic"
            fill
            priority
            className="object-contain object-bottom object-right"
          />
        </div>

      </div>

      <main className="flex w-full max-w-8xl overflow-hidden rounded-2xl bg-[#F0F2F5] shadow-xl items-left justify-between py-30 px-25 dark:bg-black sm:items-start">
        <div className="relative hidden w-2/3 lg:block mt-20 pr-24">
          <Image
            className="h-8 w-auto object-cotain"
            src="/registration.png"
            alt="Next.js logo"
            width={0}
            height={0}
            sizes="50vw"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
       <RegisterForm/>
      </main>
    </div>
  );
}
