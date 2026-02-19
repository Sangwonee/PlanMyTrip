import React from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

/* ── 애니메이션 ────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
`;

/* ── 레이아웃 ────────────────────────── */
const Page = styled.div`
  min-height: 100vh;
  background: var(--color-bg);
  overflow-y: auto;
  overflow-x: hidden;
`;

/* ── 네비바 ────────────────────────── */
const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  height: 64px;
  background: rgba(245, 249, 242, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
`;

const NavLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const NavLogoIcon = styled.div`
  width: 34px;
  height: 34px;
  background: linear-gradient(135deg, var(--color-accent-bright), var(--color-accent));
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  box-shadow: var(--shadow-card);
`;

const NavLogoText = styled.span`
  font-size: 16px;
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
  span { color: var(--color-accent); }
`;

const NavCta = styled.button`
  padding: 9px 22px;
  background: linear-gradient(135deg, var(--color-accent-bright), var(--color-accent));
  color: #fff;
  border-radius: 99px;
  font-size: 14px;
  font-weight: 600;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-card);

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-hover);
  }
`;

/* ── 히어로 ────────────────────────── */
const Hero = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 24px 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    top: -10%;
    left: 50%;
    transform: translateX(-50%);
    width: 900px;
    height: 700px;
    background: radial-gradient(ellipse at center, rgba(106,184,112,0.15) 0%, rgba(74,156,93,0.06) 40%, transparent 70%);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(to bottom, transparent, var(--color-bg));
  }
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 99px;
  background: var(--color-accent-light);
  border: 1px solid var(--color-border-hover);
  color: var(--color-accent-dark);
  font-size: 12.5px;
  font-weight: 600;
  margin-bottom: 28px;
  animation: ${fadeUp} 0.6s ease both;
  letter-spacing: 0.02em;
`;

const HeroTitle = styled.h1`
  font-size: clamp(44px, 7vw, 80px);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.04em;
  color: var(--color-text-primary);
  animation: ${fadeUp} 0.6s ease 0.1s both;
  margin-bottom: 20px;

  .highlight {
    background: linear-gradient(135deg, var(--color-accent-dark), var(--color-accent), var(--color-accent-bright));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroSub = styled.p`
  font-size: 18px;
  color: var(--color-text-secondary);
  line-height: 1.7;
  max-width: 520px;
  animation: ${fadeUp} 0.6s ease 0.2s both;
  margin-bottom: 40px;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 14px;
  animation: ${fadeUp} 0.6s ease 0.3s both;
  flex-wrap: wrap;
  justify-content: center;
`;

const PrimaryBtn = styled.button`
  padding: 15px 36px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  color: #fff;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  transition: all var(--transition-fast);
  box-shadow: 0 6px 24px rgba(74,156,93,0.35);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 32px rgba(74,156,93,0.45);
  }
`;

const SecondaryBtn = styled.button`
  padding: 15px 36px;
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  border: 1.5px solid var(--color-border);
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--color-accent);
    color: var(--color-accent-dark);
    background: var(--color-accent-light);
    transform: translateY(-2px);
  }
`;

const HeroEmoji = styled.div`
  font-size: 80px;
  animation: ${float} 4s ease-in-out infinite;
  margin-bottom: 32px;
  animation: ${fadeUp} 0.5s ease both, ${float} 4s ease-in-out 0.5s infinite;
`;

/* ── 피처 섹션 ────────────────────────── */
const Section = styled.section<{ $bg?: string }>`
  padding: 96px 24px;
  background: ${({ $bg }) => $bg || "var(--color-bg)"};
`;

const SectionInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const SectionBadge = styled.div`
  display: inline-block;
  padding: 5px 14px;
  background: var(--color-accent-light);
  border: 1px solid var(--color-border-hover);
  color: var(--color-accent-dark);
  border-radius: 99px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.03em;
  line-height: 1.2;
  margin-bottom: 12px;
`;

const SectionSub = styled.p`
  font-size: 16px;
  color: var(--color-text-secondary);
  line-height: 1.7;
  max-width: 500px;
  margin-bottom: 56px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
`;

const FeatureCard = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 32px 28px;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--color-accent-bright), var(--color-accent));
    opacity: 0;
    transition: opacity var(--transition-normal);
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-hover);
    border-color: var(--color-border-hover);

    &::before { opacity: 1; }
  }
`;

const CardIcon = styled.div`
  font-size: 36px;
  margin-bottom: 16px;
  width: 60px;
  height: 60px;
  background: var(--color-accent-light);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 10px;
  letter-spacing: -0.02em;
`;

const CardDesc = styled.p`
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.7;
`;

/* ── 스텝 섹션 ────────────────────────── */
const StepGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  counter-reset: step-counter;
`;

const StepCard = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 28px 24px;
  position: relative;
  transition: all var(--transition-normal);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hover);
    border-color: var(--color-border-hover);
  }
`;

const StepNumber = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  border-radius: 10px;
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const StepTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.02em;
`;

const StepDesc = styled.p`
  font-size: 13.5px;
  color: var(--color-text-secondary);
  line-height: 1.7;
`;

/* ── CTA 섹션 ────────────────────────── */
const CtaSection = styled.section`
  padding: 80px 24px;
  text-align: center;
  background: linear-gradient(135deg, var(--color-accent-light) 0%, #e8f5e9 100%);
  border-top: 1px solid var(--color-border);
`;

const CtaTitle = styled.h2`
  font-size: clamp(26px, 4vw, 40px);
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.03em;
  margin-bottom: 14px;
`;

const CtaSub = styled.p`
  font-size: 16px;
  color: var(--color-text-secondary);
  margin-bottom: 36px;
`;

/* ── 푸터 ────────────────────────── */
const Footer = styled.footer`
  padding: 32px 48px;
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`;

const FooterLogo = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-secondary);
  span { color: var(--color-accent); }
`;

const FooterCopy = styled.p`
  font-size: 13px;
  color: var(--color-text-muted);
`;

/* ── 컴포넌트 ────────────────────────── */
const FEATURES = [
  {
    icon: "🤖",
    title: "AI 여행 플래너",
    desc: "OpenAI GPT-4o가 여행 스타일, 날짜, 선호도를 분석해 최적의 맞춤 일정을 자동으로 생성해드립니다.",
  },
  {
    icon: "🗺️",
    title: "실제 장소 기반 추천",
    desc: "한국관광공사 TourAPI와 연동하여 실제 운영 중인 관광지, 맛집, 숙소 데이터로 일정을 구성합니다.",
  },
  {
    icon: "📍",
    title: "카카오맵 경로 시각화",
    desc: "생성된 일정의 모든 장소를 카카오맵 위에 마커와 경로로 시각화하여 한눈에 파악할 수 있습니다.",
  },
];

const STEPS = [
  { n: "01", title: "여행 정보 입력", desc: "날짜, 지역, 여행 유형, 이동 수단을 선택하세요." },
  { n: "02", title: "자유롭게 요청", desc: "원하는 여행 스타일이나 특별한 요청사항을 채팅으로 입력하세요." },
  { n: "03", title: "AI 일정 생성", desc: "AI가 실제 장소 데이터를 기반으로 날짜별 최적 일정을 만들어드립니다." },
  { n: "04", title: "지도로 확인", desc: "생성된 일정을 카카오맵에서 경로와 함께 확인하고 바로 여행을 떠나세요!" },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const goChat = () => navigate("/plan");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Page>
      {/* 네비바 */}
      <Nav>
        <NavLogo onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <NavLogoIcon>🗺️</NavLogoIcon>
          <NavLogoText>Plan<span>My</span>Trip</NavLogoText>
        </NavLogo>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          <span
            style={{ fontSize: 14, color: "var(--color-text-secondary)", cursor: "pointer", fontWeight: 500 }}
            onClick={() => scrollTo("features")}
          >
            서비스 소개
          </span>
          <span
            style={{ fontSize: 14, color: "var(--color-text-secondary)", cursor: "pointer", fontWeight: 500 }}
            onClick={() => scrollTo("how-to")}
          >
            사용 방법
          </span>
          <NavCta onClick={goChat}>지금 시작하기</NavCta>
        </div>
      </Nav>

      {/* 히어로 */}
      <Hero>
        <HeroBg />
        <HeroEmoji>✈️</HeroEmoji>
        <HeroBadge>✦ AI Travel Planner ✦</HeroBadge>
        <HeroTitle>
          여행 계획,<br />
          <span className="highlight">AI가 다 해드릴게요</span>
        </HeroTitle>
        <HeroSub>
          날짜와 지역만 알려주세요.<br />
          실제 장소 데이터를 기반으로 최적의 여행 일정을 만들어드립니다.
        </HeroSub>
        <HeroButtons>
          <PrimaryBtn onClick={goChat}>✨ 무료로 시작하기</PrimaryBtn>
          <SecondaryBtn onClick={() => scrollTo("how-to")}>사용 방법 보기</SecondaryBtn>
        </HeroButtons>
      </Hero>

      {/* 서비스 소개 */}
      <Section $bg="var(--color-bg-secondary)" id="features">
        <SectionInner>
          <SectionBadge>Features</SectionBadge>
          <SectionTitle>왜 PlanMyTrip인가요?</SectionTitle>
          <SectionSub>
            AI와 실제 데이터의 결합으로 더 똑똑하고 정확한 여행 일정을 경험하세요.
          </SectionSub>
          <CardGrid>
            {FEATURES.map((f) => (
              <FeatureCard key={f.title}>
                <CardIcon>{f.icon}</CardIcon>
                <CardTitle>{f.title}</CardTitle>
                <CardDesc>{f.desc}</CardDesc>
              </FeatureCard>
            ))}
          </CardGrid>
        </SectionInner>
      </Section>

      {/* 사용 방법 */}
      <Section id="how-to">
        <SectionInner>
          <SectionBadge>How to use</SectionBadge>
          <SectionTitle>간단한 4단계로 완성</SectionTitle>
          <SectionSub>복잡한 여행 계획은 그만, 쉽고 빠르게 여행 일정을 만들어보세요.</SectionSub>
          <StepGrid>
            {STEPS.map((s) => (
              <StepCard key={s.n}>
                <StepNumber>{s.n}</StepNumber>
                <StepTitle>{s.title}</StepTitle>
                <StepDesc>{s.desc}</StepDesc>
              </StepCard>
            ))}
          </StepGrid>
        </SectionInner>
      </Section>

      {/* CTA */}
      <CtaSection>
        <CtaTitle>지금 바로 여행 일정을 만들어보세요</CtaTitle>
        <CtaSub>무료로 사용할 수 있어요. 지금 바로 시작해보세요!</CtaSub>
        <PrimaryBtn onClick={goChat} style={{ fontSize: 17, padding: "16px 44px" }}>
          ✨ 지금 시작하기
        </PrimaryBtn>
      </CtaSection>

      {/* 푸터 */}
      <Footer>
        <FooterLogo>Plan<span>My</span>Trip</FooterLogo>
        <FooterCopy>© 2026 PlanMyTrip. AI 기반 여행 일정 플래너</FooterCopy>
      </Footer>
    </Page>
  );
};

export default LandingPage;
