const Error500 = () => {
    return (
        <div className="error-container">
            <h1 className="error-code">Oh, no...</h1>
            <p className="error-message">The server not respond or in maintenance. Please, try again.</p>
            <a className="btn-join" onClick={() => window.location.reload()}>Click to reconnect</a>
        </div>
    );
};

export default Error500;
