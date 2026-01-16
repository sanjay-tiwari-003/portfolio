import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

interface Certificate {
  id: number;
  title: string;
  date: string;
  description: string;
  icon: string;
  image: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  certificates: Certificate[] = [
    {
      id: 1,
      title: 'HTML & CSS Certification',
      date: 'August 2021',
      description: '4-hour hands-on workshop on building web pages, styling layouts, and responsive design concepts.',
      icon: 'fas fa-certificate',
      image: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=HTML+%26+CSS+Certificate'
    },
    {
      id: 2,
      title: 'Google Analytics Workshop',
      date: 'August 2021',
      description: '1.5-hour workshop on understanding website metrics, user behavior, and performance analysis.',
      icon: 'fas fa-chart-line',
      image: 'https://via.placeholder.com/600x400/7C3AED/FFFFFF?text=Google+Analytics+Certificate'
    },
    {
      id: 3,
      title: 'Java Programming Fundamentals',
      date: 'September 2021',
      description: '8-hour Udemy course on core Java concepts, OOP basics, and implementing sample projects.',
      icon: 'fab fa-java',
      image: 'https://via.placeholder.com/600x400/2563EB/FFFFFF?text=Java+Programming+Certificate'
    }
  ];

  activeSection = 'home';
  showScrollTop = false;
  isScrolled = false;
  mobileMenuOpen = false;
  selectedCertificate: Certificate | null = null;
  contactForm!: FormGroup;
  particles = Array(8).fill(0).map((_, i) => i);

  protected readonly title = signal('Sanjay Tiwari Portfolio');

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
    this.initializeAOS();
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  private initializeAOS() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
        }
      });
    }, observerOptions);

    setTimeout(() => {
      const elements = document.querySelectorAll('[data-aos]');
      elements.forEach(el => observer.observe(el));
    }, 100);
  }

  private setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '-100px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId) {
            this.activeSection = sectionId;
          }
        }
      });
    }, observerOptions);

    setTimeout(() => {
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => observer.observe(section));
    }, 100);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = window.pageYOffset;

    this.showScrollTop = scrollPosition > 300;
    this.isScrolled = scrollPosition > 50;

    this.updateParallax(scrollPosition);
  }

  private updateParallax(scrollPosition: number) {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && scrollPosition < window.innerHeight) {
      const parallaxSpeed = 0.5;
      (heroSection as HTMLElement).style.transform = `translateY(${scrollPosition * parallaxSpeed}px)`;
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;

    if (this.mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      if (this.mobileMenuOpen) {
        this.toggleMobileMenu();
      }
    }
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  openSocialLink(platform: string) {
    const links: { [key: string]: string } = {
      linkedin: 'https://www.linkedin.com/in/sanjay0099',
      github: 'https://github.com/sanjay-tiwari-003',
    };

    const url = links[platform];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  openCertificate(certificate: Certificate): void {
    this.selectedCertificate = certificate;
    document.body.style.overflow = 'hidden';
  }

  closeCertificate(): void {
    this.selectedCertificate = null;
    document.body.style.overflow = '';
  }

  sendEmail() {
    if (this.contactForm.invalid) {
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formData = this.contactForm.value;
    console.log('Form submitted:', formData);

    alert(`Thank you ${formData.name}! Your message has been received. I'll get back to you soon.`);

    this.contactForm.reset();
  }
}
