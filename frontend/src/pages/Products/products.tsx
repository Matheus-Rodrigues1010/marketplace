import React from 'react';

export default function Products() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-blue-500 text-white p-4 rounded mb-6">
        <h1 className="text-3xl font-bold">Produtos/Serviços</h1>
      </header>
      <main>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white shadow rounded">Produto 1</div>
          <div className="p-4 bg-white shadow rounded">Produto 2</div>
          <div className="p-4 bg-white shadow rounded">Produto 3</div>
        </div>
      </main>
    </div>
  );
}
