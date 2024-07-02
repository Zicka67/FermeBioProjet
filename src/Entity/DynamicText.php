<?php

namespace App\Entity;

use App\Repository\DynamicTextRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DynamicTextRepository::class)]
class DynamicText
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $button_text = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $blurred_section_text = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $blurred_section_title = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getButtonText(): ?string
    {
        return $this->button_text;
    }

    public function setButtonText(string $button_text): static
    {
        $this->button_text = $button_text;

        return $this;
    }

    public function getBlurredSectionText(): ?string
    {
        return $this->blurred_section_text;
    }

    public function setBlurredSectionText(string $blurred_section_text): static
    {
        $this->blurred_section_text = $blurred_section_text;

        return $this;
    }

    public function getBlurredSectionTitle(): ?string
    {
        return $this->blurred_section_title;
    }

    public function setBlurredSectionTitle(string $blurred_section_title): static
    {
        $this->blurred_section_title = $blurred_section_title;

        return $this;
    }
}
