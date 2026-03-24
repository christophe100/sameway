

const NotFound = () => {
    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#172628] px-5">
            <h1 className="text-4xl font-bold text-center mt-20 text-white">404 - Page non trouvée</h1>
            <p className="text-center mt-4 text-lg text-gray-300">Désolé, la page que vous recherchez n'existe pas.</p>
            <div className="flex items-center justify-center mt-10">
                <a href="/" className="text-white bg-[#2C5F63] px-4 py-2 rounded-lg shadow-lg hover:bg-[#1a3d40] transition duration-300">
                    Retour à l'accueil
                </a>
            </div>
        </div>
    )
}


export default NotFound;