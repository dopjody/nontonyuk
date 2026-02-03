export default function Footer() {
    return (
        <footer className="w-full bg-[#141414] py-12 px-4 md:px-12 border-t border-gray-800 text-gray-500 text-sm">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex flex-col gap-4">
                    <a href="#" className="hover:underline">Audio and Subtitles</a>
                    <a href="#" className="hover:underline">Media Center</a>
                    <a href="#" className="hover:underline">Privacy</a>
                    <a href="#" className="hover:underline">Contact Us</a>
                </div>
                <div className="flex flex-col gap-4">
                    <a href="#" className="hover:underline">Audio Description</a>
                    <a href="#" className="hover:underline">Investor Relations</a>
                    <a href="#" className="hover:underline">Legal Notices</a>
                </div>
                <div className="flex flex-col gap-4">
                    <a href="#" className="hover:underline">Help Center</a>
                    <a href="#" className="hover:underline">Jobs</a>
                    <a href="#" className="hover:underline">Cookie Preferences</a>
                </div>
                <div className="flex flex-col gap-4">
                    <a href="#" className="hover:underline">Gift Cards</a>
                    <a href="#" className="hover:underline">Terms of Use</a>
                    <a href="#" className="hover:underline">Corporate Information</a>
                </div>
            </div>
            <div className="max-w-6xl mx-auto mt-8">
                <button className="border border-gray-500 px-4 py-2 hover:text-white">Service Code</button>
                <p className="mt-4 text-xs">© 2026 NontonYuk, Inc.</p>
            </div>
        </footer>
    );
}
