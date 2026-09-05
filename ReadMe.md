php -S localhost:8000

http://localhost:8000/contact.html

php -S 0.0.0.0:8000

CREATE TABLE contact_submissions (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    work_email VARCHAR(150) NOT NULL,
    phone_num VARCHAR(50) NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    website_url VARCHAR(255),
    industry_sector VARCHAR(100) NOT NULL,
    monthly_revenue VARCHAR(100) NOT NULL,
    business_model VARCHAR(50) NOT NULL,
    team_size VARCHAR(50) NOT NULL,
    services_needed TEXT[], -- Stores array of selected services
    monthly_ad_spend VARCHAR(100) NOT NULL,
    timeframe VARCHAR(100) NOT NULL,
    primary_bottleneck TEXT NOT NULL,
    success_vision TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
