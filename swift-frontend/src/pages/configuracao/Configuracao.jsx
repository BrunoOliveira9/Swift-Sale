import './Configuracao.css'
import logo from '../inicio/SW.svg';

function Configuracao() {

    const configuracoes = [
      { name: 'Permissões' },
      { name: 'Configuração de impressora' },
      { name: 'Dados da empresa' },
      { name: 'Logo e identidade visual' },
      { name: 'Certificado digital' },
      { name: 'Séries e numeração fiscal' },
      { name: 'Alíquotas e impostos' },
      { name: 'Formas de pagamento' },
      { name: 'Política de descontos' },
      { name: 'Abertura e fechamento de caixa' },
      { name: 'Cadastro rápido de produtos' },
      { name: 'Categorias de produtos' },
      { name: 'Controle de estoque mínimo' },
      { name: 'Política de devolução e trocas' },
      { name: 'Cadastro de clientes' },
      { name: 'Programa de fidelidade' },
      { name: 'Integração com TEF (cartão)' },
      { name: 'Integração com balança' },
      { name: 'Integração com e-commerce' },
      { name: 'Backup e restauração' },
      { name: 'Política de senhas' },
      { name: 'Relatórios e exportações' },
      { name: 'Tema e personalização da interface' }
    ]

    return (
        <div className="content">
            <div className="row">
                <div className="col-3 navigation-left p-0">

                    <div className="row">
                        <div className="col-12 logo-swift-sale d-flex justify-content-center">
                            <img src={logo} alt="Swift Logo" className="logo-centered" />
                        </div>
                    </div>

                    <div className="row w-100">
                        <div className="col-12 buttons-navigation p-0">
                            {configuracoes.map((item, idx) => (
                                <button key={idx} className='btn-config'>
                                    { item.name }
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
                <div className="col-9 configuration p-0">
                    bb
                </div>
            </div>
        </div>
    )
}

export default Configuracao