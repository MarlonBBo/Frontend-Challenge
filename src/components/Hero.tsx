
import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"
import heroImage from "@/assets/8459204731e6eba9d474cbc8ebc37071360d3ba5 (1).png"
import { ArrowRight } from "lucide-react"

export function Hero(){
    return(
        <section className="relative mx-auto mt-3 grid min-h-[174px] w-full max-w-[1200px] grid-cols-[1.3fr_1fr] items-start gap-1 overflow-hidden rounded-[28px] bg-linear-to-br from-[#8B633B] via-[#5B4028] to-[#261812] px-4 pt-2 pb-7 sm:gap-5 sm:p-6 lg:mt-8 lg:min-h-[450px] lg:grid-cols-[minmax(0,600px)_minmax(0,450px)] lg:items-center lg:justify-between lg:gap-8 lg:overflow-visible lg:rounded-none lg:bg-none lg:p-0">
            <div className="relative min-w-0 lg:min-h-[364px] lg:pb-8">
                <div>
                    <div>
                        <div>
                            <div className="text-[10px] font-medium leading-4 text-[#F7F3EC] sm:text-sm lg:tracking-[0.1em]">
                                Bem-vindo à Kurio
                            </div>
                            <h1 className="mt-1 text-base font-bold leading-[26px] text-[#F5F1EB] sm:text-2xl sm:leading-9 lg:text-[clamp(30px,3vw,43px)] lg:leading-[1.63]">
                                <span className="lg:hidden">SEJA DONO DA CULTURA DIGITAL</span>
                                <span className="hidden lg:inline">SEJA DONO DO FUTURO DA ARTE DIGITAL</span>
                            </h1>
                        </div>
                        <p className="mt-2 text-[11px] leading-4 text-[#CFB28C] sm:text-sm sm:leading-6 lg:max-w-[557px]">
                            <span className="lg:hidden">Descubra NFTs selecionados de criadores do mundo todo.</span>
                            <span className="hidden lg:inline">Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.</span>
                        </p>
                    </div>
                    <Button
                        render={<Link to="/mercado" />}
                        nativeButton={false}
                        variant="kurio"
                        className="mt-0 h-7 justify-start gap-2 bg-transparent p-0 text-[11px] font-bold text-[#E89B55] hover:bg-transparent sm:mt-3 sm:text-sm lg:mt-8 lg:h-10 lg:w-[140px] lg:justify-center lg:rounded-md lg:bg-[#D28A4C] lg:px-7 lg:text-base lg:text-[#140D0A] lg:hover:bg-[#E89B55]"
                    >
                        EXPLORAR <ArrowRight className="size-4 lg:hidden" aria-hidden="true" />
                    </Button>
                </div>
                <div className="absolute right-0 bottom-0 hidden gap-2 lg:flex" aria-hidden="true">
                    <span className="size-2 rounded-full bg-[#D28A4C]" />
                    <span className="size-2 rounded-full bg-[#D28A4C]" />
                    <span className="size-2 rounded-full bg-[#D28A4C]" />
                </div>
            </div>
            <div className="relative mt-1 min-w-0 lg:mt-0">
            <img
                src={heroImage}
                alt="Arte digital de um macaco com óculos escuros e jaqueta verde"
                width={450}
                height={450}
                className="aspect-square w-full rounded-[14px] object-cover lg:rounded-[24px]"
            />
            
            </div>
            <div className="absolute inset-x-0 bottom-1.5 flex justify-center gap-1.5 lg:hidden" aria-hidden="true"><span className="size-1.5 rounded-full bg-[#D28A4C]" /><span className="size-1.5 rounded-full bg-[#D28A4C]" /><span className="size-1.5 rounded-full bg-[#D28A4C]" /></div>
        </section>
    )
}
