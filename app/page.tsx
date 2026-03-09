"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { Target, Handshake, Landmark, ArrowRight, CheckCircle2, ShieldCheck, Home as HomeIcon, Store, Car, X } from "lucide-react";

const FadeIn = ({ children, delay = 0, className = "" }: { children: ReactNode, className?: string, delay?: number }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
            {children}
        </div>
    );
};

export default function Home() {
    const [formData, setFormData] = useState({
        fullName: "",
        cedula: "",
        telefono: "",
        ciudad: "",
        servicio: "",
        privacyAccepted: false
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (name === "cedula" || name === "telefono") {
            const formatted = value.replace(/\D/g, "").slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: formatted }));
            return;
        }

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.cedula.length !== 10) {
            setStatus("error");
            setMessage("La cédula debe tener exactamente 10 dígitos numéricos.");
            return;
        }
        if (formData.telefono.length < 9) {
            setStatus("error");
            setMessage("Por favor ingresa un número de teléfono válido.");
            return;
        }
        if (!formData.servicio) {
            setStatus("error");
            setMessage("Por favor selecciona un servicio de interés.");
            return;
        }
        if (!formData.privacyAccepted) {
            setStatus("error");
            setMessage("Debes aceptar el tratamiento de datos para continuar.");
            return;
        }

        setStatus("loading");
        try {
            const response = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Error submitting form");

            setStatus("success");
            setMessage("¡Gracias por registrarte! Nos pondremos en contacto contigo pronto.");
            setFormData({ fullName: "", cedula: "", telefono: "", ciudad: "", servicio: "", privacyAccepted: false });
        } catch (err) {
            console.error(err);
            setStatus("error");
            setMessage("Hubo un error al procesar tu solicitud. Intenta nuevamente más tarde.");
        }
    };

    return (
        <main className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 overflow-x-hidden">
            {/* Navbar */}
            <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 border-b border-slate-900/10 dark:border-slate-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Target className="h-8 w-8 text-coral-500" />
                            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Prospecciona</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setShowModal(true)}
                                className="text-sm font-semibold leading-6 text-slate-900 dark:text-white hover:text-coral-500 transition-colors"
                            >
                                Conócenos
                            </button>
                            <a href="#contacto" className="text-sm font-semibold leading-6 text-slate-900 dark:text-white hover:text-coral-500 transition-colors">
                                Contáctanos <span aria-hidden="true">&rarr;</span>
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Modal Conócenos */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-coral-100 dark:bg-coral-900/30">
                                <ShieldCheck className="h-6 w-6 text-coral-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Sobre Prospecciona</h3>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-8">
                            Somos un equipo de profesionales con amplia experiencia en evaluación de riesgos, garantizando transacciones y validaciones seguras para tu tranquilidad financiera y empresarial.
                        </p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full bg-coral-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-coral-600 transition-colors"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative pt-24 pb-32 overflow-hidden sm:pt-32 sm:pb-40">
                <FadeIn delay={100} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8">
                        Tu puente hacia <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-coral-600">
                            soluciones financieras seguras
                        </span>
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
                        Prospecciona conecta tu visión con las oportunidades. Ofrecemos herramientas de evaluación, intermediación ágil y análisis de riesgo para negocios y personas.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a
                            href="#contacto"
                            className="group flex items-center justify-center gap-2 rounded-full bg-coral-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-coral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500 transition-all duration-300 transform hover:scale-105"
                        >
                            Comienza hoy mismo
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </FadeIn>
                {/* Background Decorative Blur */}
                <div className="absolute top-0 inset-x-0 h-full overflow-hidden -z-10 flex justify-center pointer-events-none">
                    <div className="w-[108rem] flex-none flex justify-end">
                        <div className="w-[71.75rem] flex-none max-w-none opacity-20 dark:opacity-10 bg-gradient-to-tr from-coral-200 to-slate-200 blur-3xl rounded-full mix-blend-multiply h-[40rem]" />
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="servicios" className="py-24 sm:py-32 bg-white dark:bg-slate-950">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <FadeIn className="mx-auto max-w-2xl text-center">
                        <h2 className="text-base font-semibold leading-7 text-coral-500">Nuestros Servicios</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                            Soluciones integrales de riesgo y crédito
                        </p>
                    </FadeIn>

                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2 lg:gap-y-16">
                            {/* Service 1 */}
                            <FadeIn delay={100} className="relative pl-16 group p-8 rounded-3xl transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:shadow-xl">
                                <dt className="text-base font-semibold leading-7 text-slate-900 dark:text-white">
                                    <div className="absolute left-4 top-8 flex h-10 w-10 items-center justify-center rounded-lg bg-coral-500 transition-transform group-hover:scale-110">
                                        <Landmark className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    Créditos con Cooperativas y Bancos
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-400">
                                    Intermediación profesional para asegurar las mejores tasas del mercado. Facilitamos y agilizamos la obtención de créditos con nuestra red de confianza.
                                </dd>
                            </FadeIn>

                            {/* Service 2 */}
                            <FadeIn delay={200} className="relative pl-16 group p-8 rounded-3xl transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:shadow-xl">
                                <dt className="text-base font-semibold leading-7 text-slate-900 dark:text-white">
                                    <div className="absolute left-4 top-8 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-800 transition-transform group-hover:scale-110">
                                        <HomeIcon className="h-6 w-6 text-coral-500" aria-hidden="true" />
                                    </div>
                                    Arriendos Seguros
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-400">
                                    Validación exhaustiva de perfiles para que puedas arrendar tus propiedades de forma fiable, minimizando riesgos y asegurando tu rentabilidad.
                                </dd>
                            </FadeIn>

                            {/* Service 3 */}
                            <FadeIn delay={300} className="relative pl-16 group p-8 rounded-3xl transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:shadow-xl">
                                <dt className="text-base font-semibold leading-7 text-slate-900 dark:text-white">
                                    <div className="absolute left-4 top-8 flex h-10 w-10 items-center justify-center rounded-lg bg-coral-500 transition-transform group-hover:scale-110">
                                        <Store className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    Crédito Directo para Negocios
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-400">
                                    Evaluación de fiabilidad diseñada para dueños de pequeños negocios que venden a crédito, protegiendo tu capital y fomentando ventas seguras.
                                </dd>
                            </FadeIn>

                            {/* Service 4 */}
                            <FadeIn delay={400} className="relative pl-16 group p-8 rounded-3xl transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:shadow-xl">
                                <dt className="text-base font-semibold leading-7 text-slate-900 dark:text-white">
                                    <div className="absolute left-4 top-8 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-800 transition-transform group-hover:scale-110">
                                        <Car className="h-6 w-6 text-coral-500" aria-hidden="true" />
                                    </div>
                                    Rastreo Vehicular
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-400">
                                    Implementación de dispositivos de seguridad avanzados para el rastreo y protección continua de flotas y vehículos particulares.
                                </dd>
                            </FadeIn>

                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 sm:py-32 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <FadeIn className="mx-auto max-w-2xl text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Cómo Funciona</h2>
                        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                            Un proceso simple diseñado para brindarte seguridad rápidamente.
                        </p>
                    </FadeIn>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
                        <FadeIn delay={100} className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-coral-500 mb-6 z-10 shadow-lg">1</div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Registro</h3>
                            <p className="text-slate-600 dark:text-slate-400">Completa el formulario seleccionando el servicio de tu interés.</p>
                        </FadeIn>
                        <FadeIn delay={200} className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-coral-500 mb-6 z-10 shadow-lg">2</div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Evaluación</h3>
                            <p className="text-slate-600 dark:text-slate-400">Nuestro equipo experto analiza la viabilidad y mitiga los riesgos inmediatamente.</p>
                        </FadeIn>
                        <FadeIn delay={300} className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-coral-500 flex items-center justify-center text-xl font-bold text-white mb-6 z-10 shadow-lg shadow-coral-500/30">3</div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Solución Activa</h3>
                            <p className="text-slate-600 dark:text-slate-400">Recibe la validación, dispositivos o el crédito listo para consolidar tus metas.</p>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Lead Generation Form */}
            <section id="contacto" className="py-24 sm:py-32 relative isolate overflow-hidden">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <FadeIn className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Empieza a trabajar con seguridad</h2>
                        <p className="mt-2 text-lg leading-8 text-slate-600 dark:text-slate-400">
                            Déjanos tus datos y el servicio que necesitas. Te contactaremos con la mejor solución.
                        </p>
                    </FadeIn>
                    <FadeIn delay={200} className="mx-auto mt-10 max-w-xl lg:mx-0 lg:max-w-none">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8 max-w-xl p-8 bg-white dark:bg-slate-950 rounded-2xl shadow-xl ring-1 ring-slate-900/5 sm:p-10">
                            <div className="sm:col-span-2">
                                <label htmlFor="fullName" className="block text-sm font-semibold leading-6 text-slate-900 dark:text-white">
                                    Nombre Completo
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        type="text"
                                        name="fullName"
                                        id="fullName"
                                        required
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 dark:text-white dark:bg-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-coral-500 sm:text-sm sm:leading-6"
                                        placeholder="Ej. Juan Pérez"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-1">
                                <label htmlFor="cedula" className="block text-sm font-semibold leading-6 text-slate-900 dark:text-white">
                                    Cédula
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        type="text"
                                        name="cedula"
                                        id="cedula"
                                        required
                                        maxLength={10}
                                        value={formData.cedula}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 dark:text-white dark:bg-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-coral-500 sm:text-sm sm:leading-6"
                                        placeholder="Ej. 1712345678"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-1">
                                <label htmlFor="telefono" className="block text-sm font-semibold leading-6 text-slate-900 dark:text-white">
                                    Teléfono Móvil
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        type="text"
                                        name="telefono"
                                        id="telefono"
                                        required
                                        maxLength={10}
                                        value={formData.telefono}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 dark:text-white dark:bg-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-coral-500 sm:text-sm sm:leading-6"
                                        placeholder="Ej. 0991234567"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="ciudad" className="block text-sm font-semibold leading-6 text-slate-900 dark:text-white">
                                    Ciudad
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        type="text"
                                        name="ciudad"
                                        id="ciudad"
                                        required
                                        value={formData.ciudad}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 dark:text-white dark:bg-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-coral-500 sm:text-sm sm:leading-6"
                                        placeholder="Ej. Quito"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="servicio" className="block text-sm font-semibold leading-6 text-slate-900 dark:text-white">
                                    Servicio de Interés
                                </label>
                                <div className="mt-2.5">
                                    <select
                                        name="servicio"
                                        id="servicio"
                                        required
                                        value={formData.servicio}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-0 px-3.5 py-2.5 text-slate-900 dark:text-white dark:bg-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-coral-500 sm:text-sm sm:leading-6"
                                    >
                                        <option value="" disabled>Selecciona un servicio</option>
                                        <option value="Créditos con Cooperativas y Bancos">Créditos con Cooperativas y Bancos</option>
                                        <option value="Arriendos Seguros">Arriendos Seguros</option>
                                        <option value="Crédito Directo para Negocios">Crédito Directo para Negocios</option>
                                        <option value="Rastreo Vehicular">Rastreo Vehicular</option>
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-2 flex items-start gap-3">
                                <div className="flex h-6 items-center">
                                    <input
                                        id="privacyAccepted"
                                        name="privacyAccepted"
                                        type="checkbox"
                                        required
                                        checked={formData.privacyAccepted}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 rounded border-slate-300 text-coral-500 focus:ring-coral-500 dark:bg-slate-900 dark:border-slate-700 dark:checked:bg-coral-500"
                                    />
                                </div>
                                <div className="text-sm leading-6">
                                    <label htmlFor="privacyAccepted" className="font-medium text-slate-700 dark:text-slate-300">
                                        Acepto que mis datos sean tratados según las <a href="#" className="text-coral-500 hover:text-coral-400">Políticas de Privacidad</a> de Prospecciona.
                                    </label>
                                </div>
                            </div>

                            {message && (
                                <div className={`sm:col-span-2 p-4 rounded-md flex gap-2 items-center ${status === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                                    {status === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <ShieldCheck className="w-5 h-5 flex-shrink-0" />}
                                    <span className="text-sm font-medium">{message}</span>
                                </div>
                            )}

                            <div className="sm:col-span-2">
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="block w-full rounded-md bg-coral-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-coral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                                >
                                    {status === 'loading' ? 'Enviando...' : 'Solicitar Información'}
                                </button>
                            </div>
                        </form>
                    </FadeIn>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 border-t border-slate-900">
                <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="flex justify-center space-x-6 md:order-2">
                        <a href="#" className="text-slate-400 hover:text-coral-500 text-sm font-medium transition-colors">
                            Términos y Condiciones
                        </a>
                        <a href="#" className="text-slate-400 hover:text-coral-500 text-sm font-medium transition-colors">
                            Políticas de Privacidad
                        </a>
                    </div>
                    <div className="mt-8 md:order-1 md:mt-0">
                        <p className="text-center text-xs leading-5 text-slate-400">
                            &copy; {new Date().getFullYear()} Prospecciona S.A. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
