export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          🎓 School Management System
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sistema de Gestão de Horário Integral
        </p>
        <div className="space-y-4">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-2xl font-semibold text-blue-800 mb-2">
              ✅ Phase 1 - Infrastructure & Security
            </h2>
            <p className="text-gray-700">
              Backend ready on <code className="bg-gray-200 px-2 py-1 rounded">http://localhost:5000</code>
            </p>
            <p className="text-gray-700">
              Frontend running on <code className="bg-gray-200 px-2 py-1 rounded">http://localhost:3000</code>
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              🚀 API Endpoints Ready
            </h3>
            <ul className="text-left text-gray-700 space-y-1">
              <li>✅ POST /api/auth/login</li>
              <li>✅ POST /api/auth/signup</li>
              <li>✅ GET /api/auth/me</li>
              <li>✅ GET /api/auth/users</li>
              <li>✅ POST /api/auth/change-password</li>
              <li>✅ GET /health</li>
            </ul>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">
              📚 Test API with curl
            </h3>
            <code className="text-sm bg-gray-200 p-3 rounded block mb-2">
              curl http://localhost:5000/health
            </code>
            <code className="text-sm bg-gray-200 p-3 rounded block">
              curl -X POST http://localhost:5000/api/auth/login \<br/>
              &nbsp;-d '{"{"}email: ..., password: ...{"}"}' \<br/>
              &nbsp;-H "Content-Type: application/json"
            </code>
          </div>
        </div>
      </div>
    </main>
  );
}
