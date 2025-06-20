import { Link } from "react-router-dom";

const About = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <h1 className="text-3xl font-bold">Sobre</h1>
      <p>Este aplicativo foi feito por Giseldo Neo.</p>
      <p className="text-muted-foreground">giseldo@gmail.com</p>
      <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
        Voltar para Início
      </Link>
    </div>
  </div>
);

export default About;
